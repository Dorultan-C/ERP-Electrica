
export default function QuickActionsWidget() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="flex flex-col space-y-2">
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded">
          Add New User
        </button>
        <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-2 px-4 rounded">
          Request Vacation
        </button>
        <button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-2 px-4 rounded">
          Submit Timesheet
        </button>
      </div>
    </div>
  );
}
