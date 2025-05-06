
import './Loading.css'
export const Loading=()=>{
return (
    <div className="modal-backdrop">
    <div className="modal-content">
        <div className="paymentProgressBar">
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
        <defs>
            <linearGradient id="GradientColor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(14, 255, 199)" />
            <stop offset="50%" stopColor="rgb(127, 80, 175)" />
            <stop offset="100%" stopColor="rgb(141, 176, 167)" />
            </linearGradient>
        </defs>

        <circle r="90" cx="100" cy="100" fill="transparent" stroke="#e0e0e0" strokeWidth="12px" />
        <circle
            className="progress-spinner"
            r="90"
            cx="100"
            cy="100"
            fill="transparent"
            stroke="url(#GradientColor)"
            strokeLinecap="round"
            strokeWidth="12px"
            strokeDasharray="565.2"
            strokeDashoffset="425"
        />
        
        <text
            x="100"
            y="110"
            textAnchor="middle"
            fill="#6bdba7"
            fontSize="16"
            fontWeight="bold"
            transform="rotate(90, 100, 100)"
        >
            Loading...
        </text>
        </svg>

        {/* <p style={{ marginTop: "1rem", fontSize: "18px" }}>Processing...</p> */}
        </div>
    </div>
    </div>
);
};
      