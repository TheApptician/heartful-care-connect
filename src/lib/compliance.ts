// Introductory Agency Compliance Utilities (PRD v2.3.2 Compliant)
import { ComplianceCheck } from '@/types/database';

/**
 * Keywords that must be filtered to maintain Heems Introductory Agency status
 * These words suggest employment/staffing relationship which is not allowed
 */
const PROHIBITED_KEYWORDS = [
    'employ',
    'employee',
    'employer',
    'employment',
    'hire',
    'hiring',
    'staff',
    'staffing',
    'payroll',
    'salary',
    'wage',
    'contract of employment',
    'permanent position',
    'full-time',
    'part-time',
    'zero hours',
    'employed by',
    'work for us',
    'join our team',
    'recruitment',
];

/**
 * Check if a message contains prohibited keywords
 * @param message - The message content to check
 * @returns detailed compliance result
 */
export function checkMessageCompliance(message: string): {
    passed: boolean;
    detectedKeywords: string[];
    message?: string;
} {
    const lowerMessage = message.toLowerCase();
    const detected: string[] = [];

    for (const keyword of PROHIBITED_KEYWORDS) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
            detected.push(keyword);
        }
    }

    if (detected.length > 0) {
        return {
            passed: false,
            detectedKeywords: detected,
            message: `Your message contains prohibited language. Heems operates as an introductory agency. Please avoid employment-related terms.`,
        };
    }

    return {
        passed: true,
        detectedKeywords: [],
    };
}

/**
 * Sanitize message by replacing prohibited keywords with alternatives
 * @param message - The message to sanitize
 * @returns Sanitized message
 */
export function sanitizeMessage(message: string): string {
    let sanitized = message;

    const replacements: Record<string, string> = {
        'employ': 'engage',
        'employee': 'carer',
        'employer': 'client',
        'employment': 'engagement',
        'hire': 'book',
        'hiring': 'booking',
        'staff': 'carer',
        'staffing': 'care provision',
        'payroll': 'payment',
        'salary': 'rate',
        'wage': 'rate',
    };

    for (const [prohibited, replacement] of Object.entries(replacements)) {
        const regex = new RegExp(`\\b${prohibited}\\b`, 'gi');
        sanitized = sanitized.replace(regex, replacement);
    }

    return sanitized;
}

/**
 * Get compliance warning message for users
 */
export function getComplianceWarning(): string {
    return `
⚠️ Important: Heems operates as a Transactional Introductory Agency

We connect families with self-employed carers. This means:
- Carers are NOT employees of Heems or clients
- Carers set their own rates and manage their own tax
- Clients book care sessions directly with carers
- Heems facilitates introductions and secure payments

Please avoid using employment-related language in your messages.
  `.trim();
}

/**
 * Check if a carer profile meets verification requirements
 */
export function checkVerificationCompliance(verification: {
    dbs_status: string;
    id_status: string;
    rtw_status: string;
    insurance_status: string;
    overall_status: string;
}): ComplianceCheck {
    const allVerified =
        verification.dbs_status === 'verified' &&
        verification.id_status === 'verified' &&
        verification.rtw_status === 'verified' &&
        verification.insurance_status === 'verified';

    if (!allVerified) {
        return {
            type: 'verification_status',
            passed: false,
            message: 'All verification documents must be approved before appearing in marketplace',
        };
    }

    if (verification.overall_status !== 'verified') {
        return {
            type: 'verification_status',
            passed: false,
            message: 'Overall verification status must be "verified"',
        };
    }

    return {
        type: 'verification_status',
        passed: true,
    };
}

/**
 * Check if a rate meets the minimum requirement
 */
export function checkRateCompliance(rate: number, minimum: number = 15.00): ComplianceCheck {
    if (rate < minimum) {
        return {
            type: 'rate_minimum',
            passed: false,
            message: `Rate must be at least £${minimum.toFixed(2)}/hour`,
        };
    }

    return {
        type: 'rate_minimum',
        passed: true,
    };
}

/**
 * Check if a document has expired
 */
export function isDocumentExpired(expiryDate: string | null): boolean {
    if (!expiryDate) return false;

    const expiry = new Date(expiryDate);
    const now = new Date();

    return expiry < now;
}

/**
 * Check if a document is expiring soon (within 30 days)
 */
export function isDocumentExpiringSoon(expiryDate: string | null, daysThreshold: number = 30): boolean {
    if (!expiryDate) return false;

    const expiry = new Date(expiryDate);
    const now = new Date();
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + daysThreshold);

    return expiry > now && expiry <= threshold;
}

/**
 * Get verification badges based on verification status
 */
export function getVerificationBadges(verification: {
    dbs_status: string;
    insurance_status: string;
    overall_status: string;
}): string[] {
    const badges: string[] = [];

    if (verification.dbs_status === 'verified') {
        badges.push('DBS Checked');
    }

    if (verification.insurance_status === 'verified') {
        badges.push('Insured');
    }

    if (verification.overall_status === 'verified') {
        badges.push('Vetted');
    }

    return badges;
}

/**
 * Get verification badge info with color and label
 */
export function getVerificationBadge(status: string): { color: string; label: string } {
    switch (status) {
        case 'verified':
            return { color: 'bg-green-500', label: 'Verified' };
        case 'pending':
            return { color: 'bg-amber-500', label: 'Pending' };
        case 'rejected':
            return { color: 'bg-red-500', label: 'Rejected' };
        case 'expired':
            return { color: 'bg-gray-500', label: 'Expired' };
        default:
            return { color: 'bg-slate-500', label: 'Unknown' };
    }
}

/**
 * Validate that a carer has minimum 2 verified referrals
 */
export function checkReferralCompliance(referrals: any[]): ComplianceCheck {
    const verifiedReferrals = referrals.filter(r => r.status === 'verified');

    if (verifiedReferrals.length < 2) {
        return {
            type: 'verification_status',
            passed: false,
            message: `At least 2 verified referrals required. Current: ${verifiedReferrals.length}`,
        };
    }

    return {
        type: 'verification_status',
        passed: true,
    };
}
