import React from 'react';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
            </header>
            
            <div className="dashboard-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <p className="stat-value">1,234</p>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Revenue</h3>
                        <p className="stat-value">$12,345</p>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Active Sessions</h3>
                        <p className="stat-value">89</p>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Conversion Rate</h3>
                        <p className="stat-value">3.2%</p>
                    </div>
                </div>
                
                <div className="dashboard-sections">
                    <section className="dashboard-section">
                        <h2>Recent Activity</h2>
                        <div className="activity-list">
                            <p>No recent activity</p>
                        </div>
                    </section>
                    
                    <section className="dashboard-section">
                        <h2>Quick Actions</h2>
                        <div className="action-buttons">
                            <button className="action-btn">Add New Item</button>
                            <button className="action-btn">View Reports</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;