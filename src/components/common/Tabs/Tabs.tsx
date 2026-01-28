import styles from './Tabs.module.scss'

export interface Tab<T extends string = string> {
  id: T
  label: string
}

export interface TabsProps<T extends string = string> {
  tabs: readonly Tab<T>[]
  activeTab: T
  onTabChange: (tabId: T) => void
  className?: string
}

function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}: TabsProps<T>) {
  return (
    <div className={`${styles.tabs} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
          onClick={() => onTabChange(tab.id)}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default Tabs
