import React from 'react';
import { 
  FiHeadphones, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiMessageSquare,
  FiAlertCircle,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';

const HelpAndSupport = () => {
  const faqs = [
    {
      question: "How do I file a complaint?",
      answer: "You can file a complaint through our online portal, mobile app, or by visiting any of our regional offices."
    },
    {
      question: "How long does it take to resolve a complaint?",
      answer: "Resolution time varies depending on the issue. Simple complaints may be resolved within 3-5 days, while complex cases may take several weeks."
    },
    {
      question: "Can I track my complaint status?",
      answer: "Yes, you can track your complaint status using the unique ticket number provided when you filed the complaint."
    },
    {
      question: "What information do I need to file a complaint?",
      answer: "You'll need your personal details, location information, and specific details about the issue you're reporting."
    }
  ];

  const contactMethods = [
    {
      icon: <FiPhone className="text-blue-600 text-2xl" />,
      title: "Phone Support",
      details: ["Main: +250 788 123 456", "Hotline: 3020 (Toll-free)"],
      available: "Mon-Fri: 8AM-5PM, Sat: 9AM-1PM"
    },
    {
      icon: <FiMail className="text-green-600 text-2xl" />,
      title: "Email Support",
      details: ["support@gov.rw", "complaints@service.rw"],
      available: "24/7 (Response within 24 hours)"
    },
    {
      icon: <FiMapPin className="text-red-600 text-2xl" />,
      title: "In-Person Support",
      details: ["KG 7 Ave, Kigali", "Regional offices across all provinces"],
      available: "Mon-Fri: 8AM-3PM"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
      
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FiHeadphones className="text-blue-600 text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help you with any questions or issues regarding government services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold">{method.title}</h3>
              </div>
              <div className="space-y-2">
                {method.details.map((detail, i) => (
                  <p key={i} className="text-gray-700">{detail}</p>
                ))}
                <p className="text-sm text-gray-500 mt-3">
                  <span className="font-medium">Available:</span> {method.available}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

      
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Complaint Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <FiAlertCircle className="text-blue-600 text-2xl" />
              </div>
              <h3 className="font-medium mb-1">1. Report</h3>
              <p className="text-sm text-gray-600">Submit your complaint through any of our channels</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                <FiClock className="text-yellow-600 text-2xl" />
              </div>
              <h3 className="font-medium mb-1">2. Review</h3>
              <p className="text-sm text-gray-600">Our team verifies and assigns your complaint</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <FiMessageSquare className="text-purple-600 text-2xl" />
              </div>
              <h3 className="font-medium mb-1">3. Update</h3>
              <p className="text-sm text-gray-600">We keep you informed about progress</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <FiCheckCircle className="text-green-600 text-2xl" />
              </div>
              <h3 className="font-medium mb-1">4. Resolve</h3>
              <p className="text-sm text-gray-600">Your complaint is addressed and closed</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Need Immediate Help?</h2>
              <p className="text-gray-700 mb-4">
                Our live chat support is available to answer your questions in real-time during business hours.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg">
                Start Live Chat
              </button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                <FiMessageSquare className="text-blue-600 text-4xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;