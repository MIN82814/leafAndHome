import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const PlantBarChart = ({ title, data }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.map((item) => ({
    ...item,
    full: 10,
  }));

  return (
    <div className="col-12 col-md-3 mb-5 mb-md-0">
      <p
        className="fs-7 fw-bold mb-2 mt-7 text-center text-md-start text-neutral-900"
      >
        {title}
      </p>

      <div style={{ width: "100%", height: 160 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
          <BarChart
            data={chartData}
            margin={{ top: 30, left: 0, right: 0, bottom: 0 }}
            barGap={-32}
          >
            <XAxis dataKey="name" hide />
            <YAxis hide domain={[0, 10]} />

            <Bar
              dataKey="value"
              fill="#A69880"
              radius={[2, 2, 0, 0]}
              barSize={32}
              background={{ fill: "#F9F7F5", radius: [2, 2, 0, 0] }}
            >
            </Bar>

            <Bar dataKey="full" fill="transparent" barSize={32} barGap={-32}>
              <LabelList
                dataKey="value"
                position="top"
                style={{
                  fontSize: "12px",
                  fill: "#666666",
                  fontWeight: "bold",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 底部文字 */}
      <div className="d-flex justify-content-between mt-3">
        {chartData.map((item, idx) => (
          <div key={idx} className="text-center flex-fill" >
            <div
              className="fw-bold"
              style={{ color: "#666666", fontSize: "12px" }}
            >
              {item.name}
            </div>
            <div
              className="fw-bold"
              style={{ color: "#666666", fontSize: "12px" }}
            >
              {item.percent}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantBarChart;
