
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  Type,
  Calendar,
  Hash,
  List,
  ToggleLeft
} from 'lucide-react';

const customFieldSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
  type: z.enum(['text', 'number', 'date', 'select', 'multiselect', 'boolean'], {
    required_error: 'Please select a field type'
  }),
  description: z.string().optional(),
  required: z.boolean().default(false),
  options: z.string().optional(),
  defaultValue: z.string().optional()
});

type CustomFieldFormData = z.infer<typeof customFieldSchema>;

interface CustomField {
  id: string;
  name: string;
  type: string;
  description?: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
  createdAt: string;
  usageCount: number;
}

const CustomFieldsManager = () => {
  const [fields, setFields] = useState<CustomField[]>([
    {
      id: '1',
      name: 'Customer Impact',
      type: 'select',
      description: 'Level of impact on customers',
      required: true,
      options: ['Low', 'Medium', 'High', 'Critical'],
      createdAt: '2024-01-10',
      usageCount: 156
    },
    {
      id: '2',
      name: 'Release Version',
      type: 'text',
      description: 'Target release version',
      required: false,
      createdAt: '2024-01-08',
      usageCount: 89
    },
    {
      id: '3',
      name: 'Testing Required',
      type: 'boolean',
      description: 'Does this issue require QA testing?',
      required: false,
      defaultValue: 'true',
      createdAt: '2024-01-05',
      usageCount: 234
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);

  const form = useForm<CustomFieldFormData>({
    resolver: zodResolver(customFieldSchema),
    defaultValues: {
      name: '',
      type: 'text',
      description: '',
      required: false,
      options: '',
      defaultValue: ''
    }
  });

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="h-4 w-4" />;
      case 'number':
        return <Hash className="h-4 w-4" />;
      case 'date':
        return <Calendar className="h-4 w-4" />;
      case 'select':
      case 'multiselect':
        return <List className="h-4 w-4" />;
      case 'boolean':
        return <ToggleLeft className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  const getFieldTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      text: 'bg-blue-100 text-blue-800',
      number: 'bg-green-100 text-green-800',
      date: 'bg-purple-100 text-purple-800',
      select: 'bg-orange-100 text-orange-800',
      multiselect: 'bg-orange-100 text-orange-800',
      boolean: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    );
  };

  const onSubmit = (data: CustomFieldFormData) => {
    const newField: CustomField = {
      id: editingField?.id || Date.now().toString(),
      name: data.name,
      type: data.type,
      description: data.description,
      required: data.required,
      options: data.options ? data.options.split(',').map(opt => opt.trim()) : undefined,
      defaultValue: data.defaultValue,
      createdAt: editingField?.createdAt || new Date().toISOString().split('T')[0],
      usageCount: editingField?.usageCount || 0
    };

    if (editingField) {
      setFields(fields.map(field => field.id === editingField.id ? newField : field));
    } else {
      setFields([...fields, newField]);
    }

    setIsDialogOpen(false);
    setEditingField(null);
    form.reset();
  };

  const handleEdit = (field: CustomField) => {
    setEditingField(field);
    form.reset({
      name: field.name,
      type: field.type as any,
      description: field.description || '',
      required: field.required,
      options: field.options?.join(', ') || '',
      defaultValue: field.defaultValue || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId));
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingField(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Custom Fields
              </CardTitle>
              <CardDescription>
                Create and manage custom fields for your issues
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingField ? 'Edit Custom Field' : 'Create Custom Field'}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter field name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select field type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="select">Single Select</SelectItem>
                              <SelectItem value="multiselect">Multi Select</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Field description (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {(form.watch('type') === 'select' || form.watch('type') === 'multiselect') && (
                      <FormField
                        control={form.control}
                        name="options"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Options *</FormLabel>
                            <FormControl>
                              <Input placeholder="Option 1, Option 2, Option 3" {...field} />
                            </FormControl>
                            <p className="text-xs text-gray-500">
                              Separate options with commas
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="defaultValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Value</FormLabel>
                          <FormControl>
                            <Input placeholder="Default value (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="required"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel>Required Field</FormLabel>
                            <p className="text-sm text-gray-500">
                              Make this field mandatory when creating issues
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={handleDialogClose}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingField ? 'Update Field' : 'Create Field'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFieldTypeIcon(field.type)}
                      <span className="font-medium">{field.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getFieldTypeBadge(field.type)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {field.description || 'No description'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {field.required ? (
                      <Badge variant="destructive">Required</Badge>
                    ) : (
                      <Badge variant="outline">Optional</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{field.usageCount} issues</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">{field.createdAt}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(field)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomFieldsManager;
