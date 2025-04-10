"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Sample Data (Replace with API Fetching)x
interface Category {
  id: number;
  name: string;
}

const sampleCategories: Category[] = [
  { id: 1, name: "Singer-songwriter" },
  { id: 2, name: "Rapper" },
  { id: 3, name: "Pop" },
  { id: 4, name: "Rock" },
  { id: 5, name: "Electronic" },
];

const ArtistCategoriesPage = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // Filter categories based on search query
    const filteredCategories = sampleCategories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCategories(filteredCategories);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleNewCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewCategoryName(e.target.value);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") {
      toast({
        title: "Error",
        description: "Category name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const newCategory: Category = {
      id: categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1,
      name: newCategoryName,
    };
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    toast({
      title: "Success",
      description: "Category added successfully.",
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditCategory(category);
  };

  const handleSaveEditCategory = () => {
    if (!editCategory) return;

    const updatedCategories = categories.map((c) =>
      c.id === editCategory.id ? editCategory : c
    );
    setCategories(updatedCategories);
    setEditCategory(null);
    toast({
      title: "Success",
      description: "Category updated successfully.",
    });
  };

  const handleDeleteCategory = (categoryId: number) => {
    const updatedCategories = categories.filter(
      (category) => category.id !== categoryId
    );
    setCategories(updatedCategories);
    toast({
      title: "Success",
      description: "Category deleted successfully.",
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Artist Categories</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Enter the name of the new artist category.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={handleNewCategoryChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* Search Bar */}
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      {/* Category List */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                {editCategory?.id === category.id ? (
                  <Input
                    value={editCategory.name}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  category.name
                )}
              </TableCell>
              <TableCell className="text-right">
                {editCategory?.id === category.id ? (
                  <Button variant="outline" onClick={handleSaveEditCategory}>
                    Save
                  </Button>
                ) : (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ArtistCategoriesPage;
