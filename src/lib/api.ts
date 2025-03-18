import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Types
export interface User {
  id: string;
  email: string;
  username?: string;
  isVendor: boolean;
  paypalEmail?: string;
  createdAt?: string;
}

export interface Artwork {
  id: string;
  title: string;
  description?: string;
  prompt: string;
  artStyle: string;
  sketchImageUrl?: string;
  generatedImageUrl: string;
  isListed: boolean;
  price?: number;
  createdAt: string;
  userId: string;
  artist?: string;
}

export interface Order {
  id: string;
  artworkId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  commission: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  artwork?: {
    title: string;
    generated_image_url: string;
  };
  buyer?: {
    username?: string;
  };
  seller?: {
    username?: string;
  };
}

// Auth methods
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return null;
    }
    
    return {
      id: user.id,
      email: user.email || '',
      username: profile.username,
      isVendor: profile.is_vendor,
      paypalEmail: profile.paypal_email,
      createdAt: profile.created_at,
    };
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

export const signIn = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data.user) {
      return null;
    }
    
    // Get user profile
    const userProfile = await getCurrentUser();
    
    return userProfile;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signUp = async (
  username: string,
  email: string,
  password: string,
  isVendor: boolean,
  paypalEmail?: string
): Promise<User | null> => {
  try {
    // Validation
    if (isVendor && !paypalEmail) {
      throw new Error('PayPal email is required for vendors');
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          is_vendor: isVendor,
          paypal_email: paypalEmail,
        },
      },
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data.user) {
      return null;
    }
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      username,
      isVendor,
      paypalEmail,
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Signout error:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?reset=true`,
    });
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// Artwork methods
export const saveArtwork = async (
  title: string,
  description: string,
  prompt: string,
  generatedImageUrl: string,
  artStyle: string,
  sketchImageUrl?: string,
  price?: number
): Promise<Artwork | null> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('artworks')
      .insert({
        user_id: user.id,
        title,
        description,
        prompt,
        art_style: artStyle,
        sketch_image_url: sketchImageUrl,
        generated_image_url: generatedImageUrl,
        is_listed: Boolean(price),
        price,
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      prompt: data.prompt,
      artStyle: data.art_style,
      sketchImageUrl: data.sketch_image_url,
      generatedImageUrl: data.generated_image_url,
      isListed: data.is_listed,
      price: data.price,
      createdAt: data.created_at,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('Save artwork error:', error);
    throw error;
  }
};

export const getUserArtworks = async (): Promise<Artwork[]> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw new Error(error.message);
    }
    
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      prompt: item.prompt,
      artStyle: item.art_style,
      sketchImageUrl: item.sketch_image_url,
      generatedImageUrl: item.generated_image_url,
      isListed: item.is_listed,
      price: item.price,
      createdAt: item.created_at,
      userId: item.user_id,
    }));
  } catch (error) {
    console.error('Get user artworks error:', error);
    throw error;
  }
};

export const listArtwork = async (artworkId: string, price: number, description: string): Promise<Artwork | null> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('artworks')
      .update({
        is_listed: true,
        price,
        description,
      })
      .eq('id', artworkId)
      .eq('user_id', user.id) // Security check
      .select()
      .single();
      
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      prompt: data.prompt,
      artStyle: data.art_style,
      sketchImageUrl: data.sketch_image_url,
      generatedImageUrl: data.generated_image_url,
      isListed: data.is_listed,
      price: data.price,
      createdAt: data.created_at,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('List artwork error:', error);
    throw error;
  }
};

// Marketplace methods
export const getMarketplaceArtworks = async (): Promise<Artwork[]> => {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        profiles:user_id (
          username
        )
      `)
      .eq('is_listed', true)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw new Error(error.message);
    }
    
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      prompt: item.prompt,
      artStyle: item.art_style,
      sketchImageUrl: item.sketch_image_url,
      generatedImageUrl: item.generated_image_url,
      isListed: item.is_listed,
      price: item.price || 0, // Provide a default value for price
      createdAt: item.created_at,
      userId: item.user_id,
      artist: item.profiles && typeof item.profiles === 'object' && 'username' in item.profiles 
        ? (item.profiles.username as string || 'Unknown Artist')
        : 'Unknown Artist',
    }));
  } catch (error) {
    console.error('Get marketplace artworks error:', error);
    throw error;
  }
};

export const purchaseArtwork = async (artworkId: string, sellerId: string, price: number): Promise<Order | null> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    // Calculate commission (10%)
    const commission = price * 0.1;
    
    // Create order
    const { data, error } = await supabase
      .from('orders')
      .insert({
        artwork_id: artworkId,
        buyer_id: user.id,
        seller_id: sellerId,
        amount: price,
        commission,
        status: 'completed' as 'pending' | 'completed' | 'cancelled', // Explicitly cast the string to the union type
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      artworkId: data.artwork_id,
      buyerId: data.buyer_id,
      sellerId: data.seller_id,
      amount: data.amount,
      commission: data.commission,
      status: data.status as 'pending' | 'completed' | 'cancelled', // Explicitly cast to union type
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Purchase artwork error:', error);
    throw error;
  }
};

export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        artworks:artwork_id (
          title,
          generated_image_url
        ),
        buyer:buyer_id (
          username
        ),
        seller:seller_id (
          username
        )
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw new Error(error.message);
    }
    
    return data.map((item) => ({
      id: item.id,
      artworkId: item.artwork_id,
      buyerId: item.buyer_id,
      sellerId: item.seller_id,
      amount: item.amount,
      commission: item.commission,
      status: item.status as 'pending' | 'completed' | 'cancelled', // Explicitly cast to union type
      createdAt: item.created_at,
      artwork: item.artworks,
      buyer: item.buyer && typeof item.buyer === 'object' && 'username' in item.buyer
        ? { username: (item.buyer.username as string) || 'Unknown' }
        : { username: 'Unknown' },
      seller: item.seller && typeof item.seller === 'object' && 'username' in item.seller
        ? { username: (item.seller.username as string) || 'Unknown' }
        : { username: 'Unknown' },
    }));
  } catch (error) {
    console.error('Get user orders error:', error);
    throw error;
  }
};

export const updateUserToVendor = async (paypalEmail: string): Promise<User | null> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        is_vendor: true,
        paypal_email: paypalEmail,
      })
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) {
      throw new Error(error.message);
    }
    
    // Update user metadata
    await supabase.auth.updateUser({
      data: {
        is_vendor: true,
        paypal_email: paypalEmail,
      },
    });
    
    return {
      id: user.id,
      email: user.email || '',
      username: data.username,
      isVendor: true,
      paypalEmail,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Update user to vendor error:', error);
    throw error;
  }
};
