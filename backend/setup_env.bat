@echo off
echo === Creating virtual environment ===
py -3.10 -m venv spacy_env

echo.
echo === Activating virtual environment ===
call spacy_env\Scripts\activate

echo.
echo === Upgrading pip and essentials ===
python -m pip install --upgrade pip setuptools wheel

echo.
echo === Installing all required libraries ===
pip install spacy transformers pytesseract opencv-python pdfplumber python-docx django djangorestframework

echo.
echo === Downloading spaCy language model ===
python -m spacy download en_core_web_sm

echo.
echo === Verifying spaCy ===
python -c "import spacy; nlp = spacy.load('en_core_web_sm'); print('spaCy OK:', [t.text for t in nlp('spaCy is working')])"

echo.
echo === Verifying Transformers ===
python -c "from transformers import AutoTokenizer; print('Transformers OK')"

echo.
echo === Verifying pytesseract ===
python -c "import pytesseract; print('pytesseract OK (if Tesseract OCR is installed)')"

echo.
echo === Verifying OpenCV ===
python -c "import cv2; print('OpenCV OK:', cv2.__version__)"

echo.
echo === Verifying pdfplumber ===
python -c "import pdfplumber; print('pdfplumber OK')"

echo.
echo === Verifying python-docx ===
python -c "import docx; print('python-docx OK')"

echo.
echo === Verifying Django ===
python -c "import django; print('Django version:', django.get_version())"

echo.
echo === Verifying Django REST framework ===
python -c "import rest_framework; print('Django REST framework OK')"

echo.
echo ✅ Setup complete! To activate later, run: spacy_env\Scripts\activate
pause
