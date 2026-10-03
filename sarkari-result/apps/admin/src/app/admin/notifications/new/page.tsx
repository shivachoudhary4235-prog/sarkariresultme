import { NotificationEditor } from '../../../../components/NotificationEditor';

export default function NewNotificationPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-5 border border-gray-200 shadow-2xs rounded-xs">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-serif">
          Create New Notification
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Publish a new job vacancy, admit card, syllabus, or exam result.
        </p>
      </div>

      <NotificationEditor />
    </div>
  );
}
