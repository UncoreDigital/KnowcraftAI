import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, FileText, Globe, Type, HelpCircle, Upload, Map, BookOpen, Database, Link, File, MessageSquare } from "lucide-react";
import type { KnowledgeBase } from "@shared/schema";

export default function KnowledgeBasePage() {
  const [items, setItems] = useState<KnowledgeBase[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeBase | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "file" as "file" | "url" | "text" | "qa" | "sitemap" | "notion",
    source: "",
    content: "",
    category: "",
    accessLevel: "private" as "private" | "public",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'add' | 'view'>('add');
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/knowledge-base");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch knowledge base items", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      source: formData.type === 'file' && selectedFile ? selectedFile.name : formData.source,
      fileSize: selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : undefined,
    };

    try {
      const url = editingItem ? `/api/knowledge-base/${editingItem.id}` : "/api/knowledge-base";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast({ title: "Success", description: `Source ${editingItem ? 'updated' : 'created'} successfully` });
        setIsDialogOpen(false);
        resetForm();
        fetchItems();
      } else {
        throw new Error("Failed to save source");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save source", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const response = await fetch(`/api/knowledge-base/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast({ title: "Success", description: "Item deleted successfully" });
        fetchItems();
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
    }
  };

  const handleEdit = (item: KnowledgeBase) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type as "file" | "url" | "text" | "qa" | "sitemap" | "notion",
      source: item.source || "",
      content: item.content || "",
      category: item.category || "",
      accessLevel: (item.accessLevel as "private" | "public") || "private",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "file",
      source: "",
      content: "",
      category: "",
      accessLevel: "private",
    });
    setSelectedFile(null);
    setEditingItem(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, uploadedFileName: file.name }));
    }
  };

  const sourceTypes = [
    {
      type: 'file',
      title: 'File Upload',
      description: 'Upload PDF, DOC, TXT files',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      type: 'url',
      title: 'Website URL',
      description: 'Add a single web page',
      icon: Globe,
      color: 'text-green-500',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      type: 'sitemap',
      title: 'Sitemap',
      description: 'Import entire website via sitemap',
      icon: Map,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      type: 'notion',
      title: 'Notion',
      description: 'Connect your Notion workspace',
      icon: BookOpen,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 hover:bg-gray-100'
    },
    {
      type: 'text',
      title: 'Text Content',
      description: 'Paste or write text directly',
      icon: Type,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 hover:bg-orange-100'
    },
    {
      type: 'qa',
      title: 'Q&A Pairs',
      description: 'Add question and answer pairs',
      icon: HelpCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50 hover:bg-red-100'
    }
  ];

  const handleSourceTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, type: type as any }));
    setIsDialogOpen(true);
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900" data-testid="page-knowledge-base">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{mode === 'add' ? 'Add Knowledge Sources' : 'Knowledge Base'}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {mode === 'add' ? "Choose how you'd like to add knowledge to your AI assistant. You can upload files, connect websites, or paste text directly." : "View and manage your knowledge sources."}
            </p>
          </div>
          <ToggleGroup type="single" value={mode} onValueChange={(value) => value && setMode(value as 'add' | 'view')} className="ml-4">
            <ToggleGroupItem value="add">Add</ToggleGroupItem>
            <ToggleGroupItem value="view">View</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {mode === 'add' && (
          <>
            {/* Source Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sourceTypes.map((sourceType) => {
            const IconComponent = sourceType.icon;
            return (
              <Card
                key={sourceType.type}
                className={`p-6 cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-gray-300 hover:shadow-lg ${sourceType.bgColor}`}
                onClick={() => handleSourceTypeSelect(sourceType.type)}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${sourceType.bgColor.replace('hover:', '')}`}>
                    <IconComponent className={`w-8 h-8 ${sourceType.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{sourceType.title}</h3>
                    <p className="text-gray-600">{sourceType.description}</p>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add {sourceType.title}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
          </>
        )}

        {mode === 'view' && (
          <div className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Your Sources</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage and monitor your knowledge sources</p>
              </div>
            </div>

            {items.length > 0 ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{items.length}</p>
                        <p className="text-sm text-muted-foreground">Total Sources</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-2xl font-bold">{items.filter(item => item.status === 'ready').length}</p>
                        <p className="text-sm text-muted-foreground">Ready</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="text-2xl font-bold">{items.filter(item => item.status === 'processing').length}</p>
                        <p className="text-sm text-muted-foreground">Processing</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="text-2xl font-bold">{items.filter(item => item.status === 'failed').length}</p>
                        <p className="text-sm text-muted-foreground">Failed</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sources List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => {
                    const sourceType = sourceTypes.find(st => st.type === item.type);
                    const IconComponent = sourceType?.icon || FileText;
                    return (
                      <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${sourceType?.bgColor.split(' ')[0] || 'bg-gray-50'}`}>
                              <IconComponent className={`w-5 h-5 ${sourceType?.color || 'text-gray-500'}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{item.type}</p>
                            </div>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant={item.status === 'ready' ? 'default' : item.status === 'processing' ? 'secondary' : 'destructive'}
                                className={item.status === 'processing' ? 'animate-pulse' : ''}
                              >
                                {item.status === 'processing' && <div className="w-2 h-2 bg-current rounded-full mr-1 animate-spin"></div>}
                                {item.status}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              {item.status === 'ready' ? 'The knowledge source has been successfully processed and is available for use by the AI assistant.' :
                               item.status === 'processing' ? 'The source is currently being ingested, indexed, or otherwise prepared for use. This may take some time depending on the size and type of the source.' :
                               'The processing of the source encountered an error and could not be completed. The source may need to be re-uploaded or the issue resolved.'}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        {item.category && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Category: {item.category}</p>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="flex-1">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} className="flex-1">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No knowledge sources added yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Add Source Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Source' : 'Add New Source'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Source Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter a name for this source"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Source Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "file" | "url" | "text" | "qa" | "sitemap" | "notion") =>
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        File Upload
                      </div>
                    </SelectItem>
                    <SelectItem value="url">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Website URL
                      </div>
                    </SelectItem>
                    <SelectItem value="sitemap">
                      <div className="flex items-center gap-2">
                        <Map className="w-4 h-4" />
                        Sitemap
                      </div>
                    </SelectItem>
                    <SelectItem value="notion">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Notion
                      </div>
                    </SelectItem>
                    <SelectItem value="text">
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Text Content
                      </div>
                    </SelectItem>
                    <SelectItem value="qa">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Q&A Pairs
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'file' && (
                <div>
                  <Label htmlFor="fileUpload">File Upload</Label>
                  <Input
                    id="fileUpload"
                    type="file"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
              )}

              {(formData.type === 'url' || formData.type === 'sitemap' || formData.type === 'notion') && (
                <div>
                  <Label htmlFor="source">
                    {formData.type === 'url' ? 'Website URL' : formData.type === 'sitemap' ? 'Sitemap URL' : 'Notion Page URL'}
                  </Label>
                  <Input
                    id="source"
                    type="url"
                    value={formData.source}
                    onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    placeholder={formData.type === 'url' ? 'https://example.com' : formData.type === 'sitemap' ? 'https://example.com/sitemap.xml' : 'https://notion.so/page-id'}
                    required
                  />
                </div>
              )}

              {(formData.type === 'text' || formData.type === 'qa') && (
                <div>
                  <Label htmlFor="content">
                    {formData.type === 'text' ? 'Text Content' : 'Q&A Content (format: Q: question A: answer)'}
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder={formData.type === 'text' ? 'Enter your text content here...' : 'Q: What is AI?\nA: Artificial Intelligence is...'}
                    rows={6}
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="category">Category (Optional)</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Documentation, FAQ, etc."
                />
              </div>

              <div>
                <Label htmlFor="accessLevel">Access Level</Label>
                <Select
                  value={formData.accessLevel}
                  onValueChange={(value: "private" | "public") =>
                    setFormData(prev => ({ ...prev, accessLevel: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                {editingItem ? 'Update Source' : 'Add Source'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}