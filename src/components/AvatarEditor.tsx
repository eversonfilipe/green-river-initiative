
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';

interface AvatarOptions {
  skin: { value: string; label: string }[];
  clothing: { value: string; label: string }[];
  background: { value: string; label: string }[];
  gender: { value: string; label: string }[];
  hair: { value: string; label: string }[];
  accessories: { value: string; label: string }[];
  facialHair: { value: string; label: string }[];
  eyebrows: { value: string; label: string }[];
}

interface AvatarSettings {
  skin: string;
  clothing: string;
  background: string;
  gender: string;
  hair?: string;
  accessories?: string;
  facialHair?: string;
  eyebrows?: string;
}

interface AvatarEditorProps {
  userId: string;
  initialSettings: AvatarSettings;
  onChange: (settings: AvatarSettings) => void;
}

export const AvatarEditor = ({ 
  userId, 
  initialSettings, 
  onChange 
}: AvatarEditorProps) => {
  const [settings, setSettings] = useState<AvatarSettings>(initialSettings);
  const [activeCategory, setActiveCategory] = useState<keyof AvatarSettings>('skin');
  const [previewSize, setPreviewSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  const avatarOptions: AvatarOptions = {
    skin: [
      { value: 'light', label: 'Light' },
      { value: 'medium', label: 'Medium' },
      { value: 'dark', label: 'Dark' },
      { value: 'pale', label: 'Pale' },
      { value: 'tan', label: 'Tan' },
      { value: 'golden', label: 'Golden' },
      { value: 'olive', label: 'Olive' },
    ],
    clothing: [
      { value: 'casual', label: 'Casual' },
      { value: 'formal', label: 'Formal' },
      { value: 'sporty', label: 'Sporty' },
      { value: 'business', label: 'Business' },
      { value: 'sleeveless', label: 'Sleeveless' },
      { value: 'hooded', label: 'Hooded' },
    ],
    background: [
      { value: 'blue', label: 'Blue' },
      { value: 'green', label: 'Green' },
      { value: 'purple', label: 'Purple' },
      { value: 'orange', label: 'Orange' },
      { value: 'pink', label: 'Pink' },
      { value: 'teal', label: 'Teal' },
      { value: 'red', label: 'Red' },
      { value: 'yellow', label: 'Yellow' },
      { value: 'gray', label: 'Gray' },
    ],
    gender: [
      { value: 'neutral', label: 'Neutral' },
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
    hair: [
      { value: 'short', label: 'Short' },
      { value: 'long', label: 'Long' },
      { value: 'curly', label: 'Curly' },
      { value: 'wavy', label: 'Wavy' },
      { value: 'bald', label: 'Bald' },
      { value: 'buzz', label: 'Buzz Cut' },
    ],
    accessories: [
      { value: 'none', label: 'None' },
      { value: 'glasses', label: 'Glasses' },
      { value: 'sunglasses', label: 'Sunglasses' },
      { value: 'earrings', label: 'Earrings' },
    ],
    facialHair: [
      { value: 'none', label: 'None' },
      { value: 'beard', label: 'Beard' },
      { value: 'mustache', label: 'Mustache' },
      { value: 'goatee', label: 'Goatee' },
    ],
    eyebrows: [
      { value: 'default', label: 'Default' },
      { value: 'raised', label: 'Raised' },
      { value: 'angry', label: 'Angry' },
      { value: 'concerned', label: 'Concerned' },
    ],
  };

  const categories: Array<{key: keyof AvatarSettings; label: string}> = [
    { key: 'skin', label: 'Skin' },
    { key: 'clothing', label: 'Clothing' },
    { key: 'background', label: 'Background' },
    { key: 'gender', label: 'Gender' },
    { key: 'hair', label: 'Hair' },
    { key: 'accessories', label: 'Accessories' },
    { key: 'facialHair', label: 'Facial Hair' },
    { key: 'eyebrows', label: 'Eyebrows' },
  ];
  
  // Update parent component when settings change
  useEffect(() => {
    onChange(settings);
  }, [settings, onChange]);
  
  // Generate avatar URL based on settings
  const getAvatarUrl = () => {
    const baseUrl = `https://api.dicebear.com/7.x/personas/svg`;
    const seed = userId || 'default';
    
    const params = new URLSearchParams({
      seed,
      backgroundColor: settings.background,
      skinColor: settings.skin,
      clothing: settings.clothing,
      gender: settings.gender,
    });
    
    // Add optional parameters if they exist
    if (settings.hair) params.append('hair', settings.hair);
    if (settings.accessories) params.append('accessories', settings.accessories);
    if (settings.facialHair) params.append('facialHair', settings.facialHair);
    if (settings.eyebrows) params.append('eyebrows', settings.eyebrows);
    
    return `${baseUrl}?${params.toString()}`;
  };
  
  // Handle setting changes
  const handleSettingChange = (category: keyof AvatarSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Generate random avatar
  const generateRandomAvatar = () => {
    const randomSetting = (options: {value: string}[]) => {
      const randomIndex = Math.floor(Math.random() * options.length);
      return options[randomIndex].value;
    };
    
    setSettings({
      skin: randomSetting(avatarOptions.skin),
      clothing: randomSetting(avatarOptions.clothing),
      background: randomSetting(avatarOptions.background),
      gender: randomSetting(avatarOptions.gender),
      hair: randomSetting(avatarOptions.hair),
      accessories: randomSetting(avatarOptions.accessories),
      facialHair: randomSetting(avatarOptions.facialHair),
      eyebrows: randomSetting(avatarOptions.eyebrows),
    });
  };
  
  // Navigate between categories
  const navigateCategory = (direction: 'next' | 'prev') => {
    const currentIndex = categories.findIndex(cat => cat.key === activeCategory);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % categories.length;
    } else {
      newIndex = (currentIndex - 1 + categories.length) % categories.length;
    }
    
    setActiveCategory(categories[newIndex].key);
  };
  
  // Get size class for preview
  const getPreviewSizeClass = () => {
    switch (previewSize) {
      case 'small': return 'w-24 h-24';
      case 'large': return 'w-64 h-64';
      default: return 'w-40 h-40';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex flex-col items-center">
          <div className="flex justify-center mb-2">
            <Button
              variant="outline"
              size="sm"
              className={previewSize === 'small' ? 'bg-forest-50' : ''}
              onClick={() => setPreviewSize('small')}
            >
              S
              {previewSize === 'small' && <Check className="ml-1 h-3 w-3" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`mx-1 ${previewSize === 'medium' ? 'bg-forest-50' : ''}`}
              onClick={() => setPreviewSize('medium')}
            >
              M
              {previewSize === 'medium' && <Check className="ml-1 h-3 w-3" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={previewSize === 'large' ? 'bg-forest-50' : ''}
              onClick={() => setPreviewSize('large')}
            >
              L
              {previewSize === 'large' && <Check className="ml-1 h-3 w-3" />}
            </Button>
          </div>
          <div className={`rounded-full overflow-hidden border-4 border-forest-100 ${getPreviewSizeClass()}`}>
            <img 
              src={getAvatarUrl()} 
              alt="Avatar Preview" 
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={generateRandomAvatar}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Random
          </Button>
        </div>
        
        <div className="flex-1 w-full md:w-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateCategory('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-medium text-center">
              {categories.find(cat => cat.key === activeCategory)?.label}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateCategory('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {(avatarOptions[activeCategory] || []).map((option) => (
              <Button
                key={option.value}
                variant="outline"
                size="sm"
                className={`justify-start ${settings[activeCategory] === option.value ? 'bg-forest-50 border-forest-200' : ''}`}
                onClick={() => handleSettingChange(activeCategory, option.value)}
              >
                {option.label}
                {settings[activeCategory] === option.value && <Check className="ml-auto h-3 w-3" />}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-1 mt-4">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={activeCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.key)}
                className="text-xs"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
