import useMyPlants from "../hooks/useMyPlants";

function PlantCare() {
  const { careStats } = useMyPlants();

  const stats = careStats || {
    completed: { total: 0, water: 0, fertilize: 0, repot: 0 },
    pending: { total: 0, water: 0, fertilize: 0, repot: 0 },
  };

  return (
    <div className="weekly-care-section">
      <div className="care-container">
        {/* --- 已完成 --- */}
        <div className="care-card border border-secondary-100">
          <div className="card-status-top">
            <div className="label-with-icon">
              <span className="care-icon icon-check"></span>
              <span className="status-label h6 fw-bold text-neutral-900">
                已完成
              </span>
            </div>
            <span className="status-num h4 text-primary-700">
              {stats.completed.total}
            </span>
          </div>

          <div className="divider"></div>
          <div className="care-list">
            <div className="care-row">
              <div className="item-info">
                <span className="care-icon icon-water"></span>
                <span className="item-name fs-7 text-neutral-700">澆水</span>
              </div>
              <span className="item-value h6 text-secondary-700">
                {stats.completed.water}
              </span>
            </div>
            <div className="care-row">
              <div className="item-info">
                <span className="care-icon icon-grass"></span>
                <span className="item-name fs-7 text-neutral-700">施肥</span>
              </div>
              <span className="item-value h6 text-secondary-700">
                {stats.completed.fertilize}
              </span>
            </div>
            <div className="care-row">
              <div className="item-info">
                <span className="care-icon icon-plant"></span>
                <span className="item-name fs-7 text-neutral-700">換盆</span>
              </div>
              <span className="item-value h6 text-secondary-700">
                {stats.completed.repot}
              </span>
            </div>
          </div>
        </div>

        {/* --- 待照護 --- */}
        <div className="care-card border border-secondary-100">
          <div className="card-status-top">
            <div className="label-with-icon">
              <span className="care-icon icon-care"></span>
              <span className="status-label h6 fw-bold text-neutral-900">
                待照護
              </span>
            </div>
            <span className="status-num h4 text-primary-700">
              {stats.pending.total}
            </span>
          </div>

          <div className="divider"></div>
          <div className="care-list">
            <div className="care-row">
              <div className="item-info">
                <span className="care-icon icon-water"></span>
                <span className="item-name fs-7 text-neutral-700">澆水</span>
              </div>
              <span className="item-value h6 text-secondary-700">
                {stats.pending.water}
              </span>
            </div>
            <div className="care-row">
              <div className="item-info">
                <span className="care-icon icon-grass"></span>
                <span className="item-name fs-7 text-neutral-700">施肥</span>
              </div>
              <span className="item-value h6 text-secondary-700">
                {stats.pending.fertilize}
              </span>
            </div>
            <div className="care-row">
              <div className="item-info">
                <span className="care-icon icon-plant"></span>
                <span className="item-name fs-7 text-neutral-700">換盆</span>
              </div>
              <span className="item-value h6 text-secondary-700">
                {stats.pending.repot}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantCare;
