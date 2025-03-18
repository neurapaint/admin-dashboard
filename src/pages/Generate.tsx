import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brush, DownloadCloud, RefreshCw, Sparkles, Trash, Upload, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SketchCanvas from '@/components/SketchCanvas';
import { saveArtwork } from '@/lib/api';

const ART_STYLES = [
  { value: 'photorealistic', label: 'Photorealistic' },
  { value: 'digital-art', label: 'Digital Art' },
  { value: 'oil-painting', label: 'Oil Painting' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'pencil-sketch', label: 'Pencil Sketch' },
  { value: 'anime', label: 'Anime' },
  { value: 'pixel-art', label: 'Pixel Art' },
  { value: 'abstract', label: 'Abstract' },
];

const Generate = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [sketchDataUrl, setSketchDataUrl] = useState<string | null>(null);
  const [strength, setStrength] = useState([0.7]);
  const [artStyle, setArtStyle] = useState('photorealistic');
  
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast.error('Please sign in to generate art');
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleGenerate = async () => {
    if (!prompt.trim() && !sketchDataUrl) {
      toast.error('Please provide a prompt or create a sketch');
      return;
    }
    
    if (!prompt.trim()) {
      toast.error('Please provide a text prompt');
      return;
    }
    
    try {
      setIsGenerating(true);
      toast.info('Generating your artwork...', {
        duration: 10000,
      });
      
      // Generate image using stability-ai edge function
      const { data, error } = await supabase.functions.invoke('stability-ai', {
        body: {
          prompt,
          sketch: sketchDataUrl,
          artStyle,
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data?.imageUrl) {
        throw new Error('No image was generated');
      }
      
      // Set generated image
      setGeneratedImage(data.imageUrl);
      
      // Set default title based on prompt if not provided
      if (!title) {
        setTitle(prompt.slice(0, 40) + (prompt.length > 40 ? '...' : ''));
      }
      
      toast.success('Artwork generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate artwork');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setSketchDataUrl(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  };
  
  const handleSave = async () => {
    if (!generatedImage) {
      toast.error('Please generate an image first');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast.error('Please sign in to save artworks');
        navigate('/auth');
        return;
      }
      
      // Upload sketch if available
      let sketchUrl = null;
      if (sketchDataUrl) {
        const sketchRes = await fetch(sketchDataUrl);
        const sketchBlob = await sketchRes.blob();
        const sketchFileName = `${user.id}/sketches/${Date.now()}.png`;
        
        const { data: sketchUploadData, error: sketchError } = await supabase.storage
          .from('artworks')
          .upload(sketchFileName, sketchBlob, {
            contentType: 'image/png',
            upsert: false,
          });
          
        if (sketchError) {
          console.error('Sketch upload error:', sketchError);
        } else {
          const { data: sketchData } = supabase.storage
            .from('artworks')
            .getPublicUrl(sketchFileName);
            
          sketchUrl = sketchData.publicUrl;
        }
      }
      
      // Save to artworks table
      const artwork = await saveArtwork(
        title, 
        description,
        prompt, 
        generatedImage, 
        artStyle, 
        sketchUrl
      );
      
      if (artwork) {
        toast.success('Artwork saved successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save artwork');
    }
  };
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over? This will clear your current artwork.')) {
      setTitle('');
      setDescription('');
      setPrompt('');
      setGeneratedImage(null);
      setSketchDataUrl(null);
      setArtStyle('photorealistic');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Create AI Art</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Generate unique AI artworks using text prompts and optional sketches
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Input Controls */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Text Prompt</CardTitle>
                  <CardDescription>
                    Describe what you want the AI to generate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter a detailed description of what you want to create..."
                    className="h-32"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                  />
                  
                  <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-1/2">
                      <Label>Art Style</Label>
                      <Select
                        value={artStyle}
                        onValueChange={setArtStyle}
                        disabled={isGenerating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                        <SelectContent>
                          {ART_STYLES.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-full sm:w-1/2">
                      <Label>Sketch Influence</Label>
                      <Slider
                        value={strength}
                        onValueChange={setStrength}
                        min={0.1}
                        max={1}
                        step={0.1}
                        disabled={isGenerating || !sketchDataUrl}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Subtle</span>
                        <span>Strong</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleGenerate}
                    disabled={isGenerating || (!prompt.trim() && !sketchDataUrl)}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Artwork
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sketch Input</CardTitle>
                  <CardDescription>
                    Create or upload a sketch as a reference for the AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="draw">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="draw">Draw</TabsTrigger>
                      <TabsTrigger value="upload">Upload</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="draw">
                      <div className="border rounded-lg overflow-hidden bg-white">
                        {sketchDataUrl ? (
                          <div className="relative">
                            <img 
                              src={sketchDataUrl} 
                              alt="Uploaded sketch" 
                              className="w-full h-[400px] object-contain"
                            />
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="absolute top-2 right-2"
                              onClick={() => setSketchDataUrl(null)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        ) : (
                          <SketchCanvas 
                            width={600} 
                            height={400} 
                            className="w-full h-[400px] bg-white cursor-crosshair" 
                            onSketchData={setSketchDataUrl}
                          />
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="upload">
                      <div className="border border-dashed rounded-lg h-[400px] flex flex-col items-center justify-center p-6">
                        {sketchDataUrl ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={sketchDataUrl} 
                              alt="Uploaded sketch" 
                              className="w-full h-full object-contain"
                            />
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="absolute top-2 right-2"
                              onClick={() => setSketchDataUrl(null)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload size={48} className="text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Upload your sketch</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                              Drop your image here or click to browse
                            </p>
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="sketch-upload"
                              onChange={handleFileUpload}
                            />
                            <label htmlFor="sketch-upload">
                              <Button variant="outline" className="cursor-pointer">
                                Select Image
                              </Button>
                            </label>
                          </>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Results */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Artwork</CardTitle>
                  <CardDescription>
                    Preview your AI-generated artwork
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="border rounded-lg overflow-hidden w-full aspect-square bg-muted flex items-center justify-center">
                    {generatedImage ? (
                      <img 
                        src={generatedImage} 
                        alt="Generated artwork" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <Sparkles size={64} className="mx-auto text-muted-foreground opacity-20 mb-4" />
                        <p className="text-muted-foreground">
                          Your generated artwork will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  {generatedImage && (
                    <div className="w-full space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter a title for your artwork"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your artwork (optional)"
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          variant="default" 
                          className="w-full sm:w-auto sm:flex-1"
                          onClick={handleSave}
                        >
                          Save Artwork
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full sm:w-auto"
                          onClick={handleReset}
                        >
                          Start Over
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full sm:w-auto sm:flex-none"
                          disabled
                        >
                          <DownloadCloud className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Creative Ideas</CardTitle>
                  <CardDescription>
                    Need inspiration? Try these prompts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      "A serene lake surrounded by mountains in autumn",
                      "A futuristic cityscape with flying vehicles",
                      "An astronaut riding a horse in a medieval village",
                      "A magical forest with glowing plants and mystical creatures",
                      "An underwater city with mermaids and coral architecture"
                    ].map((idea, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        className="justify-start h-auto py-3 px-4"
                        onClick={() => setPrompt(idea)}
                      >
                        {idea}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Generate;
