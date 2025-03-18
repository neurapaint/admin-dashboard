import React, { useState } from 'react';
import { toast } from 'sonner';
import { ImageIcon, DollarSign, Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { listArtwork } from '@/lib/api';

interface MarketplaceListingFormProps {
  artwork: {
    id: string;
    title: string;
    generatedImageUrl: string;
    isListed: boolean;
    price?: number;
  };
  onSuccess: () => void;
}

const MarketplaceListingForm = ({ artwork, onSuccess }: MarketplaceListingFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState<string>(artwork.price?.toString() || '');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!price || parseFloat(price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await listArtwork(artwork.id, parseFloat(price), description);
      setIsOpen(false);
      toast.success('Artwork listed on marketplace');
      onSuccess();
    } catch (error) {
      console.error('Error listing artwork:', error);
      toast.error('Failed to list artwork');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={artwork.isListed ? "outline" : "default"} size="sm">
          {artwork.isListed ? 'Edit Listing' : 'List for Sale'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>List Artwork for Sale</DialogTitle>
          <DialogDescription>
            Enter details to list your artwork on the marketplace
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/3">
              <div className="aspect-square rounded-md overflow-hidden bg-muted">
                {artwork.generatedImageUrl ? (
                  <img
                    src={artwork.generatedImageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={40} />
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-2/3 space-y-4">
              <div>
                <h3 className="font-medium">{artwork.title}</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your artwork to potential buyers..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="29.99"
                    className="pl-9"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
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
              ) : artwork.isListed ? 'Update Listing' : 'List for Sale'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceListingForm;
