import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, FileText, Globe, Type, HelpCircle, Upload, Database } from "lucide-react";
import type { KnowledgeBase } from "@shared/schema";

export default function KnowledgeBasePage() {
  const [items, setItems] = useState<KnowledgeBase[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeBase | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "file" as "file" | "url" | "text" | "qa",
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
      type: item.type as "file" | "url" | "text" | "qa",
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
      bgColor: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900'
    },
    {
      type: 'url',
      title: 'Website URL',
      description: 'Add a single web page',
      icon: Globe,
      color: 'text-green-500',
      bgColor: 'bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900'
    },
    {
      type: 'text',
      title: 'Text Content',
      description: 'Paste or write text directly',
      icon: Type,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950 dark:hover:bg-orange-900'
    },
    {
      type: 'qa',
      title: 'Q&A Pairs',
      description: 'Add question and answer pairs',
      icon: HelpCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900'
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
        <div className="flex justify-between items-start mb-8">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {mode === 'add' ? 'Add Knowledge Sources' : 'Knowledge Base'}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {mode === 'add' ? "Choose how you'd like to add knowledge to your AI assistant. You can upload files, connect websites, or paste text directly." : "View and manage your knowledge sources."}
            </p>
          </div>
          
          {/* Toggle Buttons */}
          <div className="flex gap-2 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setMode('add')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                mode === 'add'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Add
            </button>
            <button
              onClick={() => setMode('view')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                mode === 'view'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              View
            </button>
          </div>
        </div>

        {mode === 'add' && (
          <>
            {/* Source Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {sourceTypes.map((sourceType) => {
            const IconComponent = sourceType.icon;
            return (
              <Card
                key={sourceType.type}
                className={`p-4 cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg ${sourceType.bgColor}`}
                onClick={() => handleSourceTypeSelect(sourceType.type)}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${sourceType.bgColor.split(' ')[0]}`}>
                    <IconComponent className={`w-6 h-6 ${sourceType.color}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">{sourceType.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{sourceType.description}</p>
                  </div>
                  <Button className="w-full mt-2" variant="outline" size="sm">
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
          </>
        )}

        {mode === 'view' && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Your Sources</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage and monitor your knowledge sources</p>
              </div>
            </div>

            {items.length > 0 ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

                {/* Sources Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            SR
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Source Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Source Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Website URL
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Access Level
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Condition
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Options
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map((item, index) => (
                          <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                              {index + 1}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                              {item.name}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {item.type}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                              {item.source ? (
                                <a 
                                  href={item.source} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700 hover:underline"
                                >
                                  {item.source.length > 40 ? item.source.substring(0, 40) + '...' : item.source}
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                              {item.category || '-'}
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <Badge variant={item.accessLevel === 'public' ? 'default' : 'secondary'} className="capitalize">
                                {item.accessLevel}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant={item.status === 'ready' ? 'default' : item.status === 'processing' ? 'secondary' : 'destructive'}
                                    className={`capitalize ${item.status === 'processing' ? 'animate-pulse' : ''}`}
                                  >
                                    {item.status === 'processing' && <div className="w-2 h-2 bg-current rounded-full mr-1 animate-spin"></div>}
                                    {item.status}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {item.status === 'ready' ? 'Successfully processed and available' :
                                   item.status === 'processing' ? 'Currently being processed' :
                                   'Processing failed'}
                                </TooltipContent>
                              </Tooltip>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleEdit(item)}
                                  className="h-8 px-2"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleDelete(item.id)}
                                  className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                  onValueChange={(value: "file" | "url" | "text" | "qa") =>
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

              {formData.type === 'url' && (
                <div>
                  <Label htmlFor="source">Website URL</Label>
                  <Input
                    id="source"
                    type="url"
                    value={formData.source}
                    onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    placeholder="https://example.com"
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
