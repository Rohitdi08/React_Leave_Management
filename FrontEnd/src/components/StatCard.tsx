type StatCardProps = {
    label: string;
    value: number;
    tone?: "default" | "pending" | "approved" | "rejected";
};

function StatCard({ label, value, tone = "default" }: StatCardProps) {
    return (
        <div className={`stat-card stat-${tone}`}>
            <span className="stat-label">{label}</span>
            <span className="stat-value">{value}</span>
        </div>
    );
}

export default StatCard;
