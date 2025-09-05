import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { Shield, Car, Home, ChevronLeft, Share, Bookmark } from 'lucide-react';

const LegalGuides = () => {
  const [selectedGuide, setSelectedGuide] = useState(null);

  const legalGuides = {
    police_stop: {
      title: "Police Stop Rights",
      icon: Car,
      color: "text-red-600",
      bgColor: "bg-red-50",
      content: {
        summary: "Know your rights during a police traffic stop or encounter",
        rights: [
          "You have the right to remain silent",
          "You have the right to refuse searches (except pat-downs for weapons)",
          "You have the right to ask if you're free to leave",
          "You have the right to record the interaction",
          "You have the right to an attorney if arrested"
        ],
        dos: [
          "Keep your hands visible",
          "Stay calm and polite",
          "Provide required documents when driving",
          "Clearly state if you're exercising your rights",
          "Remember details for later"
        ],
        donts: [
          "Don't resist, even if you believe the stop is unfair",
          "Don't argue or become confrontational",
          "Don't consent to searches",
          "Don't lie or provide false information",
          "Don't reach for items without permission"
        ]
      }
    },
    tenant: {
      title: "Tenant Rights",
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      content: {
        summary: "Understand your rights as a tenant regarding evictions and repairs",
        rights: [
          "Right to proper notice before eviction (usually 30 days)",
          "Right to a habitable living space",
          "Right to privacy and advance notice for inspections",
          "Right to return of security deposit",
          "Right to organize with other tenants"
        ],
        eviction: [
          "Landlord must provide written notice",
          "You have the right to contest the eviction in court",
          "Landlord cannot change locks or shut off utilities",
          "You may have right to cure violations",
          "Emergency financial assistance may be available"
        ],
        repairs: [
          "Document all repair requests in writing",
          "Landlord has reasonable time to make repairs",
          "You may have right to withhold rent for major issues",
          "You may have right to make repairs and deduct costs",
          "Report health and safety violations to authorities"
        ]
      }
    }
  };

  if (selectedGuide) {
    const guide = legalGuides[selectedGuide];
    const Icon = guide.icon;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setSelectedGuide(null)}
            className="p-2"
          >
            <ChevronLeft size={20} />
          </Button>
          <div className={`p-2 rounded-lg ${guide.bgColor}`}>
            <Icon className={`h-6 w-6 ${guide.color}`} />
          </div>
          <h2 className="text-xl font-bold text-white">{guide.title}</h2>
        </div>

        {/* Summary */}
        <Card>
          <p className="text-text-primary font-medium">{guide.content.summary}</p>
        </Card>

        {/* Basic Rights */}
        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Shield size={20} />
            Your Rights
          </h3>
          <ul className="space-y-2">
            {guide.content.rights.map((right, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span className="text-text-primary">{right}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Specific Sections */}
        {selectedGuide === 'police_stop' && (
          <>
            <Card>
              <h3 className="text-lg font-semibold text-green-600 mb-3">What TO Do</h3>
              <ul className="space-y-2">
                {guide.content.dos.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-text-primary">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-red-600 mb-3">What NOT To Do</h3>
              <ul className="space-y-2">
                {guide.content.donts.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-text-primary">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}

        {selectedGuide === 'tenant' && (
          <>
            <Card>
              <h3 className="text-lg font-semibold text-orange-600 mb-3">Eviction Process</h3>
              <ul className="space-y-2">
                {guide.content.eviction.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-text-primary">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-purple-600 mb-3">Repair Issues</h3>
              <ul className="space-y-2">
                {guide.content.repairs.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-text-primary">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="primary" className="flex-1">
            <Share size={16} />
            Share Guide
          </Button>
          <Button variant="secondary" className="flex-1">
            <Bookmark size={16} />
            Save for Later
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">Know Your Rights</h2>
        <p className="text-purple-200 text-sm">
          Quick access to essential legal information
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {Object.entries(legalGuides).map(([key, guide]) => {
          const Icon = guide.icon;
          return (
            <Card
              key={key}
              variant="interactive"
              onClick={() => setSelectedGuide(key)}
              className="border-2 border-transparent hover:border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${guide.bgColor}`}>
                  <Icon className={`h-8 w-8 ${guide.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-primary">{guide.title}</h3>
                  <p className="text-text-secondary text-sm">{guide.content.summary}</p>
                </div>
                <ChevronLeft className="h-5 w-5 text-text-secondary transform rotate-180" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Emergency Notice */}
      <Card className="border-2 border-red-200 bg-red-50">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800 mb-1">Emergency Notice</h4>
            <p className="text-red-700 text-sm">
              This information is for educational purposes only and does not constitute legal advice. 
              For specific legal situations, consult with a qualified attorney.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LegalGuides;