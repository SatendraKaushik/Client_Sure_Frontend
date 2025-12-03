"use client"

import { useState, useEffect } from "react"
import { Mail, Calendar, CheckCircle, XCircle, Eye, X } from "lucide-react"
import { toast } from "sonner"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Axios from "@/utils/Axios"

interface Recipient {
  leadId: { $oid: string }
  email: string
  name: string
  status: string
  _id: { $oid: string }
}

interface EmailFeedback {
  _id: string
  userId: string
  subject: string
  message: string
  emailType: string
  recipients?: Recipient[]
  totalRecipients: number
  successCount: number
  failedCount: number
  sentAt: string
  createdAt: string
  updatedAt: string
}

export default function EmailTrackingPage() {
  const [emails, setEmails] = useState<EmailFeedback[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState<EmailFeedback | null>(null)

  const loadEmailFeedback = async () => {
    setLoading(true)
    try {
      const response = await Axios.get('/leads/email-feedback')
      setEmails(response.data.emailFeedbacks || [])
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load email tracking data')
      setEmails([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmailFeedback()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Email Tracking</h1>
          <p className="text-sm text-gray-600 mt-1">Track all emails sent to leads</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading email history...</p>
          </div>
        ) : emails.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No emails sent yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emails.map((email) => (
              <div key={email._id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{email.subject}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(email.sentAt)}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {email.emailType}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEmail(email)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Total Recipients</p>
                    <p className="text-2xl font-semibold text-gray-900">{email.totalRecipients}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Successful</p>
                    <p className="text-2xl font-semibold text-green-600 flex items-center gap-2">
                      {email.successCount}
                      <CheckCircle className="w-5 h-5" />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Failed</p>
                    <p className="text-2xl font-semibold text-red-600 flex items-center gap-2">
                      {email.failedCount}
                      {email.failedCount > 0 && <XCircle className="w-5 h-5" />}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedEmail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Email Details</h2>
                  <button onClick={() => setSelectedEmail(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <p className="text-gray-900">{selectedEmail.subject}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{selectedEmail.message}</p>
                  </div>

                  {selectedEmail.recipients && selectedEmail.recipients.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipients ({selectedEmail.totalRecipients})</label>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selectedEmail.recipients.map((recipient) => (
                              <tr key={recipient._id.$oid}>
                                <td className="px-4 py-3 text-sm text-gray-900">{recipient.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{recipient.email}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    recipient.status === 'sent' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {recipient.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
