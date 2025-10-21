interface GeneralEnquiriesProps {
  content: {
    generalEnquiries: {
      title: string;
      phone: string;
      email: string;
      address: string;
      officeHours: Array<{
        day: string;
        hours: string;
      }>;
    };
  };
}

export default function GeneralEnquiries({ content }: GeneralEnquiriesProps) {
  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-md h-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {content.generalEnquiries.title}
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">📞 Phone</h3>
          <p className="text-gray-600">{content.generalEnquiries.phone}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">✉️ Email</h3>
          <p className="text-gray-600">
            <a
              href={`mailto:${content.generalEnquiries.email}`}
              className="text-blue-600 hover:underline"
            >
              {content.generalEnquiries.email}
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">📍 Address</h3>
          <p className="text-gray-600 whitespace-pre-line">
            {content.generalEnquiries.address}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">🕒 Office Hours</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {content.generalEnquiries.officeHours.map((schedule, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 pr-4 font-medium text-gray-700">
                      {schedule.day}
                    </td>
                    <td className="py-3 text-gray-600">{schedule.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
