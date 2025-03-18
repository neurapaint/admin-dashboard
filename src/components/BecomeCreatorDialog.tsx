import React, { useState } from 'react';
import { toast } from 'sonner';
import { CreditCard, Loader2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateUserToVendor } from '@/lib/api';

interface BecomeCreatorDialogProps {
  onSuccess: () => void;
}

const BecomeCreatorDialog = ({ onSuccess }: BecomeCreatorDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paypalEmail) {
      toast.error('Please enter your PayPal email');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await updateUserToVendor(paypalEmail);
      setIsOpen(false);
      toast.success('You are now registered as a creator!');
      onSuccess();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update account');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          Register as Creator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Become a Creator</DialogTitle>
          <DialogDescription>
            Register as a creator to sell your AI-generated artwork
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paypal-email">PayPal Email</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="paypal-email"
                  type="email"
                  placeholder="paypal@example.com"
                  className="pl-9"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground">
                We'll use this email to send your earnings
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : 'Become a Creator'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BecomeCreatorDialog;
