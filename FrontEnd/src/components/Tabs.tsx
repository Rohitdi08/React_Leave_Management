type Tab<T extends string> = {
    key: T;
    label: string;
};

type TabsProps<T extends string> = {
    tabs: Tab<T>[];
    active: T;
    onChange: (key: T) => void;
};

function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
    return (
        <nav className="tabs" role="tablist">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    role="tab"
                    aria-selected={tab.key === active}
                    className={`tab ${tab.key === active ? "tab-active" : ""}`}
                    onClick={() => onChange(tab.key)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
}

export default Tabs;
