
export default function StatsWidget() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Company Stats
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">125</p>
          <p className="text-sm text-muted-foreground">Employees</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">$1.2M</p>
          <p className="text-sm text-muted-foreground">Revenue</p>
        </div>
      </div>
    </div>
  );
}
