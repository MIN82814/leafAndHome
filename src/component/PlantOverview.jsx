import useMyPlants from "../hooks/useMyPlants";

const PlantOverview = () => {
  const { statusSummary } = useMyPlants();

  if (!statusSummary) return null;

  return (
    <div className="plant-overview-body p-4">
      <div className="total-stats-card d-flex align-items-center rounded-4 border border-secondary-100">
        <span className="label fw-bold text-neutral-700">總數</span>
        <span className="value text-primary-700 mx-auto h2">
          {statusSummary.total}
        </span>
      </div>

      <div className="status-grid-container row g-0 mt-3 rounded-4 border border-secondary-100 overflow-hidden">
        <div className="col-4 status-item">
          <span className="number text-primary-700 h4">{statusSummary.healthy}</span>
          <span className="status-label fw-bold fs-8 text-neutral-700">健康</span>
        </div>
        <div className="col-4 status-item">
          <span className="number text-primary-700 h4">{statusSummary.warning}</span>
          <span className="status-label fw-bold fs-8 text-neutral-700">需留意</span>
        </div>
        <div className="col-4 status-item">
          <span className="number text-primary-700 h4">{statusSummary.danger}</span>
          <span className="status-label fw-bold fs-8 text-neutral-700">需立即處理</span>
        </div>
      </div>
    </div>
  );
};

export default PlantOverview;