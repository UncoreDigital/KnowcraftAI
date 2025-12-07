import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Send, Paperclip, Upload, X } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  showAttachment?: boolean;
}

export default function ChatInput({ onSend, isLoading = false, showAttachment = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadFiles = () => {
    // Handle file upload logic here
    console.log("Uploading files:", selectedFiles);
    setIsUploadDialogOpen(false);
    setSelectedFiles([]);
  };

  return (
    <div className="sticky bottom-0 p-4 border-t bg-background" data-testid="input-chat">
      <div className="max-w-4xl mx-auto relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          className="min-h-12 pr-24 resize-none"
          disabled={isLoading}
          data-testid="textarea-message"
        />
        <div className="absolute right-2 bottom-2 flex gap-2">
          {showAttachment && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsUploadDialogOpen(true)}
              data-testid="button-attachment"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
          )}
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            data-testid="button-send"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-right mt-1 max-w-4xl mx-auto">
        Press Enter to send, Shift+Enter for new line
      </p>

      {/* File Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Select files to attach to your message. You can upload documents, images, and other files.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* File Input */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Click to upload files
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOC, TXT, Images (Max 10MB each)
                </p>
              </label>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Files:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Paperclip className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveFile(index)}
                        className="h-6 w-6 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadDialogOpen(false);
                  setSelectedFiles([]);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUploadFiles}
                disabled={selectedFiles.length === 0}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
