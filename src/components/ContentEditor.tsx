
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3,
  Image as ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ContentEditor = ({ value, onChange }: ContentEditorProps) => {
  const [text, setText] = useState(value);
  
  // Update parent component when text changes
  useEffect(() => {
    onChange(text);
  }, [text, onChange]);

  // Update internal state when value prop changes
  useEffect(() => {
    setText(value);
  }, [value]);

  // Handle toolbar actions
  const handleFormat = (tag: string) => {
    const textArea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textArea) return;

    const selectionStart = textArea.selectionStart;
    const selectionEnd = textArea.selectionEnd;
    const selectedText = text.substring(selectionStart, selectionEnd);

    let formattedText = '';
    let newCursorPos = selectionEnd;

    switch (tag) {
      case 'b':
        formattedText = `**${selectedText}**`;
        newCursorPos = selectionEnd + 4;
        break;
      case 'i':
        formattedText = `*${selectedText}*`;
        newCursorPos = selectionEnd + 2;
        break;
      case 'u':
        formattedText = `<u>${selectedText}</u>`;
        newCursorPos = selectionEnd + 7;
        break;
      case 'ul':
        formattedText = `\n- ${selectedText}`;
        newCursorPos = selectionEnd + 3;
        break;
      case 'ol':
        formattedText = `\n1. ${selectedText}`;
        newCursorPos = selectionEnd + 4;
        break;
      case 'quote':
        formattedText = `\n> ${selectedText}`;
        newCursorPos = selectionEnd + 3;
        break;
      case 'h1':
        formattedText = `\n# ${selectedText}`;
        newCursorPos = selectionEnd + 3;
        break;
      case 'h2':
        formattedText = `\n## ${selectedText}`;
        newCursorPos = selectionEnd + 4;
        break;
      case 'h3':
        formattedText = `\n### ${selectedText}`;
        newCursorPos = selectionEnd + 5;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        newCursorPos = selectionEnd + 6;
        break;
      case 'center':
        formattedText = `<div align="center">${selectedText}</div>`;
        newCursorPos = selectionEnd + 20;
        break;
      case 'right':
        formattedText = `<div align="right">${selectedText}</div>`;
        newCursorPos = selectionEnd + 19;
        break;
      default:
        formattedText = selectedText;
    }

    const newText = 
      text.substring(0, selectionStart) + 
      formattedText + 
      text.substring(selectionEnd);

    setText(newText);

    // Reset selection and cursor position after text changes
    setTimeout(() => {
      textArea.focus();
      textArea.setSelectionRange(
        selectionStart === selectionEnd ? newCursorPos : selectionStart,
        selectionStart === selectionEnd ? newCursorPos : selectionStart + formattedText.length
      );
    }, 0);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image file should be less than 5MB.",
          variant: "destructive",
        });
        return;
      }

      const timestamp = new Date().getTime();
      const filePath = `article-images/${timestamp}-${file.name}`;
      
      // Upload the image
      const { error: uploadError, data } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);
      
      // Insert markdown image tag at cursor position
      const textArea = document.getElementById('content-editor') as HTMLTextAreaElement;
      const cursorPos = textArea.selectionStart;
      const imageMarkdown = `\n![${file.name}](${publicUrl})\n`;
      
      const newText = 
        text.substring(0, cursorPos) + 
        imageMarkdown + 
        text.substring(cursorPos);
      
      setText(newText);
      
      toast({
        title: "Image uploaded",
        description: "Image has been added to your article.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image.",
        variant: "destructive",
      });
    }
    
    // Clear the input
    event.target.value = '';
  };

  return (
    <div className="border rounded-md">
      <div className="bg-gray-50 p-2 border-b flex flex-wrap gap-1">
        <div className="flex gap-1">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('b')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('i')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('u')}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-gray-300 mx-1" />
        
        <div className="flex gap-1">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('h1')}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('h2')}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('h3')}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-gray-300 mx-1" />
        
        <div className="flex gap-1">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('ul')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('ol')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('quote')}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-gray-300 mx-1" />
        
        <div className="flex gap-1">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('link')}
            title="Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <label>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => document.getElementById('image-upload')?.click()}
              title="Insert Image"
              asChild
            >
              <span>
                <ImageIcon className="h-4 w-4" />
              </span>
            </Button>
          </label>
        </div>
        
        <div className="h-6 w-px bg-gray-300 mx-1" />
        
        <div className="flex gap-1">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('left')}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('center')}
            title="Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('right')}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <textarea
        id="content-editor"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full min-h-[400px] p-4 focus:outline-none resize-y font-mono text-base leading-relaxed"
        placeholder="Write your article content here... Use the toolbar to format your text or add media."
      />
      
      <div className="bg-gray-50 p-2 border-t text-xs text-gray-500">
        <div>Use Markdown syntax for formatting. Preview will be available in the published article.</div>
      </div>
    </div>
  );
};
