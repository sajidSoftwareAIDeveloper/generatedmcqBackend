
#create     python -m venv spacy_env    , pip install django     , python manage.py runserver
#    spacy_env\Scripts\activate

# pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0.tar.gz , pip install spacy

# python -m spacy download en_core_web_sm     or    python -m spacy link en_core_web_sm en


# Load spaCy English model
# nlp = spacy.load("en_core_web_sm")
# # Load Hugging Face T5 question generation model
# #   valhalla/t5-base-qg-prepend   |    iarfmoose/t5-base-question-generator  | valhalla/t5-base-qg-hl
# import shutil
# shutil.rmtree("C:/Users/sajid.anwar/.cache/huggingface/hub/models--valhalla--t5-base-qg-hl")


import spacy
# from transformers import AutoTokenizer, AutoModelForSeq2SeqLM    # fast tokenize
from transformers import T5Tokenizer, T5ForConditionalGeneration   # slow tokenoze   #  pip install sentencepiece
import random

nlp = spacy.load("en_core_web_sm")

# model_name = "t5-base"
# model_name = "valhalla/t5-base-qg-prepend"
model_name="valhalla/t5-base-qg-hl"
# model_name="mrm8488/t5-base-finetuned-question-generation-ap"

# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

tokenizer = T5Tokenizer.from_pretrained(model_name, use_fast=False)
model = T5ForConditionalGeneration.from_pretrained(model_name)


def call_for_output(text):

    new_paragraph=[]
    questions=[]
    answers=[]
    options=[]
    explains=[]

    doc = nlp(text)

    # cotroll paragraph into chunks
    new_paragraph.extend(controll_paragraph(doc))

    # generate  answer
    for i in new_paragraph:
        answers.append(generate_answer(i))

    # generate question
    for paragraph,answer in zip(new_paragraph,answers):
        questions.append(generate_question(paragraph,answer))

    # generate option 
    for ans in answers:
        option=[]
        for i in ans:
            result=generate_options(i,ans)
            option.append(result)
        options.append(option)

    #generate explenations
    for paragraph,answer in zip(new_paragraph,answers):
        explain=[]
        for i in answer:
            explain.append(extract_explanation(paragraph.text,i))
        explains.append(explain)

    # Final output
    return {
        "questions": questions,
        "answers": answers,
        "options": options,
        "explanations": explains
    }



def controll_paragraph(doc):
  chunks = [doc[i:i+400] for i in range(0, len(doc), 400)]
  return chunks
#   new_paragraph.extend(chunks)


def generate_answer(doc):
  answer = set()
  for ent in doc.ents:
    if ent.label_ in ("PERSON", "ORG", "GPE", "DATE", "EVENT", "WORK_OF_ART", "NORP", "FAC",):
        answer.add(ent.text)
  return list(answer)


def make_input(answer , context):
    return f"generate question: {context.text.replace(answer, '<hl>' + answer + '<hl>')}"
    # return f"highlight: {context.text.replace(answer, '<hl> ' + answer + ' <hl>')}"
    # return f"answer: {answer} context: {context.text} </s>"


def generate_question(paragraph,answers):
  questions=[]
  for answer in answers:
      input_text = make_input(answer, paragraph)
      input_ids = tokenizer.encode(input_text, return_tensors="pt", truncation=True)
      if input_ids.shape[1] > 512:
        continue
      outputs = model.generate(input_ids, max_length=64, num_beams=4, early_stopping=True)
      question=tokenizer.decode(outputs[0], skip_special_tokens=True)
      questions.append(question)
  return questions


def generate_options(correct_answer, all_answers):
    # Ensure no duplicates and remove correct answer from distractors
    distractors = list(set(a for a in all_answers if a != correct_answer))

    # Pad with fallback distractors if needed
    while len(distractors) < 3:
        distractors.append("Dummy Option")

    # Pick 3 distractors
    selected = random.sample(distractors, 3)

    # Add correct answer and shuffle
    options = selected + [correct_answer]
    random.shuffle(options)
    return options


def extract_explanation(paragraph, answer):
    for sentence in paragraph.split('.'):
        if answer in sentence:
            words = sentence.strip().split()
            if len(words) <= 20:
                return " ".join(words).strip() + "."
            return " ".join(words[:20]).strip() + "."
    return "Explanation not found."




# Main processing function
# def call_me(paragraph_text):
#     # Prepare containers
#     new_paragraphs = []
#     questions = []
#     answers = []
#     options = []
#     explains = []

#     # Convert to SpaCy doc
#     doc = nlp(paragraph_text)

#     # Step 1: Split doc into 400-char chunks and convert each back to Doc
#     text_chunks = [doc.text[i:i+400] for i in range(0, len(doc.text), 400)]
#     new_paragraphs = [nlp(chunk) for chunk in text_chunks]

#     # Step 2: Generate answers (NER entities)
#     for chunk in new_paragraphs:
#         answer_set = set()
#         for ent in chunk.ents:
#             if ent.label_ in ("PERSON", "ORG", "GPE", "DATE", "EVENT", "WORK_OF_ART", "NORP", "FAC"):
#                 answer_set.add(ent.text)
#         answers.append(list(answer_set))

#     # Step 3: Generate questions
#     for chunk, answer_list in zip(new_paragraphs, answers):
#         question_set = []
#         for answer in answer_list:
#             context_text = chunk.text.replace(answer, f"<hl>{answer}<hl>")
#             input_text = f"generate question: {context_text}"
#             input_ids = tokenizer.encode(input_text, return_tensors="pt", truncation=True)

#             if input_ids.shape[1] > 512:
#                 continue

#             output = model.generate(input_ids, max_length=64, num_beams=4, early_stopping=True)
#             question = tokenizer.decode(output[0], skip_special_tokens=True)
#             question_set.append(question)

#         questions.append(question_set)

#     # Step 4: Generate options
#     for ans_list in answers:
#         option_set = []
#         for correct in ans_list:
#             # Remove correct answer from distractors
#             distractors = list(set(a for a in ans_list if a != correct))
#             while len(distractors) < 3:
#                 distractors.append("Dummy Option")
#             selected = random.sample(distractors, 3)
#             all_options = selected + [correct]
#             random.shuffle(all_options)
#             option_set.append(all_options)
#         options.append(option_set)

#     # Step 5: Extract explanations
#     for chunk, answer_list in zip(new_paragraphs, answers):
#         explain_set = []
#         for ans in answer_list:
#             found = False
#             for sent in chunk.sents:
#                 if ans in sent.text:
#                     words = sent.text.strip().split()
#                     truncated = " ".join(words[:20]) + ("..." if len(words) > 20 else "")
#                     explain_set.append(truncated)
#                     found = True
#                     break
#             if not found:
#                 explain_set.append("Explanation not found.")
#         explains.append(explain_set)


#     # Final output
#     return {
#         "questions": questions,
#         "answers": answers,
#         "options": options,
#         "explanations": explains
#     }

