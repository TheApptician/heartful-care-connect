-- Add payout and refund tracking columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_transfer_id TEXT,
ADD COLUMN IF NOT EXISTS payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'scheduled', 'paid', 'held', 'cancelled')),
ADD COLUMN IF NOT EXISTS payout_due_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT 'none' CHECK (refund_status IN ('none', 'requested', 'partial_proposed', 'approved', 'declined')),
ADD COLUMN IF NOT EXISTS refund_reason TEXT,
ADD COLUMN IF NOT EXISTS refund_amount_proposed INTEGER; -- In pence/cents

-- Policy: Payout is due 48 hours after care ends.
-- Trigger to set payout_due_at automatically on insert if not provided
CREATE OR REPLACE FUNCTION set_payout_due_date()
RETURNS TRIGGER AS $$
BEGIN
  -- Set payout due date to 48 hours after the end_time
  IF NEW.end_time IS NOT NULL THEN
    NEW.payout_due_at := NEW.end_time + interval '48 hours';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payout_due_date
BEFORE INSERT OR UPDATE OF end_time ON bookings
FOR EACH ROW
EXECUTE FUNCTION set_payout_due_date();
