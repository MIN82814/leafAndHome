import { useState } from 'react';

import assignmentInd from "/assignmentInd.svg";
import assignment from "/assignment.svg";
import plantE9E2D6 from "/plantE9E2D6.svg";
import favorite from "/favorite.svg";

const menuData = [
  {
    id: 'dashboard',
    title: '個人儀表板',
    icon: assignmentInd,
    children: [
      { id: 'my-plants', title: '我的植物', icon: plantE9E2D6, href: '#' }
    ]
  },
  { id: 'orders', title: '個人訂單', icon: assignment, href: '#' },
  { id: 'favorites', title: '個人收藏', icon: favorite, href: '#' },
];

const Sidemenu = () => {
  const [openIds, setOpenIds] = useState(['dashboard']);

  const toggleMenu = (id) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
      <div className="row h-100">
        <div className="col-12 col-md-6 ms-md-auto p-3">
          
          {/* 會員資訊 */}
          <div className="member-info d-flex align-items-center mb-4">
            <div className="avatar me-3">
              <img src="https://storage.googleapis.com/vue-course-api.appspot.com/leafandhome/1770724963092.png" alt="Avatar" />
            </div>
            <div>
              <p className="h4 fw-bold text-primary-700">林沐森</p>
              <p className="fs-7 fw-bold">會員</p>
            </div>
          </div>

          <nav className="d-md-block" id="sideMenu">
            <ul className="nav flex-column gap-2">
              {menuData.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isOpen = openIds.includes(item.id);

                return (
                  <li key={item.id} className="nav-item">
                    {/* 父項目 */}
                    <div 
                      className={`nav-link-item ${hasChildren ? 'has-children' : ''}`}
                      onClick={() => hasChildren && toggleMenu(item.id)}
                    >
                      <div className="d-flex align-items-center">
                        <img src={item.icon} alt="icon" className="menu-icon me-2" />
                        <span className="fw-bold">{item.title}</span>
                      </div>
                      {hasChildren && (
                        <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>▾</span>
                      )}
                    </div>

                    {/* 子選單 */}
                    {hasChildren && isOpen && (
                      <ul className="sub-menu nav flex-column ms-4 mt-1">
                        {item.children.map((child) => (
                          <li key={child.id} className="nav-item">
                            <a className="nav-link sub-link d-flex align-items-center" href={child.href}>
                              <img src={child.icon} alt="icon" className="me-2" style={{ width: '16px' }} />
                              <span>{child.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
  );
};

export default Sidemenu;