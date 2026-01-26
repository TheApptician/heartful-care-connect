// Fee Calculation Utilities (PRD v2.3.2 Compliant)
import { FeeCalculation, PricingPhase } from '@/types/database';

// Minimum hourly rate as per PRD
export const MINIMUM_HOURLY_RATE = 15.00;

// Fee percentages by phase
export const PHASE_1_CLIENT_FEE = 0.10; // 10%
export const PHASE_1_CARER_FEE = 0.00; // 0%

export const PHASE_2_CLIENT_FEE = 0.12; // 12%
export const PHASE_2_CARER_FEE = 0.08; // 8%

/**
 * Calculate fees based on the active pricing phase
 * @param baseRate - Hourly rate agreed between client and carer
 * @param hours - Number of hours for the booking
 * @param phase - Current pricing phase ('1' or '2')
 * @returns FeeCalculation object with all breakdown
 */
export function calculateFees(
    baseRate: number,
    hours: number,
    phase: PricingPhase
): FeeCalculation {
    // Enforce minimum rate
    if (baseRate < MINIMUM_HOURLY_RATE) {
        throw new Error(`Rate must be at least £${MINIMUM_HOURLY_RATE}/hour`);
    }

    const subtotal = baseRate * hours;

    // Determine fee percentages based on phase
    const clientFeePercentage = phase === '1' ? PHASE_1_CLIENT_FEE : PHASE_2_CLIENT_FEE;
    const carerFeePercentage = phase === '1' ? PHASE_1_CARER_FEE : PHASE_2_CARER_FEE;

    // Calculate fees
    const clientFee = subtotal * clientFeePercentage;
    const carerFee = subtotal * carerFeePercentage;

    // Calculate totals
    const clientTotal = subtotal + clientFee;
    const carerEarnings = subtotal - carerFee;
    const platformRevenue = clientFee + carerFee;

    return {
        baseRate,
        hours,
        subtotal,
        clientFee,
        clientFeePercentage,
        carerFee,
        carerFeePercentage,
        clientTotal,
        carerEarnings,
        platformRevenue,
    };
}

/**
 * Validate that a rate meets the minimum requirement
 */
export function validateMinimumRate(rate: number): boolean {
    return rate >= MINIMUM_HOURLY_RATE;
}

/**
 * Get the current pricing phase from system config
 * Fetches from Supabase system_config table
 */
export async function getCurrentPricingPhase(): Promise<PricingPhase> {
    try {
        // Import supabase dynamically to avoid circular dependencies
        const { supabase } = await import('@/integrations/supabase/client');

        const { data, error } = await supabase
            .from('system_config')
            .select('value')
            .eq('id', 'active_phase')
            .single();

        if (error || !data) {
            console.warn('Could not fetch pricing phase, defaulting to Phase 1:', error?.message);
            return '1';
        }

        return (data.value === '2' ? '2' : '1') as PricingPhase;
    } catch (error) {
        console.error('Error fetching pricing phase:', error);
        return '1';
    }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    }).format(amount);
}

/**
 * Calculate hours between two dates
 */
export function calculateHours(startTime: Date, endTime: Date): number {
    const diff = endTime.getTime() - startTime.getTime();
    return diff / (1000 * 60 * 60); // Convert milliseconds to hours
}

/**
 * Get fee breakdown as human-readable text
 */
export function getFeeBreakdownText(calc: FeeCalculation, phase: PricingPhase): string {
    return `
Base Rate: ${formatCurrency(calc.baseRate)}/hour × ${calc.hours} hours = ${formatCurrency(calc.subtotal)}
Client Fee (${(calc.clientFeePercentage * 100).toFixed(0)}%): ${formatCurrency(calc.clientFee)}
Carer Fee (${(calc.carerFeePercentage * 100).toFixed(0)}%): ${formatCurrency(calc.carerFee)}

Client Pays: ${formatCurrency(calc.clientTotal)}
Carer Receives: ${formatCurrency(calc.carerEarnings)}
Platform Revenue: ${formatCurrency(calc.platformRevenue)}

Current Phase: ${phase}
  `.trim();
}
