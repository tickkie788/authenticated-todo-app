export default function ProgressBar({ progress, color }) {
  return (
    <div className="outer-bar">
      <div
        className="inner-bar"
        style={{ width: `${progress}%`, backgroundColor: "orange" }}
      ></div>
      ;
    </div>
  );
}
