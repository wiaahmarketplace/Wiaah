'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Check, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { VerifiedBadge } from '@/components/verified-badge';

interface TagPeopleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTagged: (people: TaggedPerson[]) => void;
}

interface TaggedPerson {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
}

const mockUsers: TaggedPerson[] = [
  {
    id: '1',
    username: 'sarah_johnson',
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    isVerified: true,
  },
  {
    id: '2',
    username: 'mike_wilson',
    name: 'Mike Wilson',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    isVerified: false,
  },
  {
    id: '3',
    username: 'emma_davis',
    name: 'Emma Davis',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
    isVerified: true,
  },
  {
    id: '4',
    username: 'james_brown',
    name: 'James Brown',
    avatar: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=100',
    isVerified: false,
  },
];

export function TagPeopleDialog({ open, onOpenChange, onTagged }: TagPeopleDialogProps) {
  const [search, setSearch] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<TaggedPerson[]>([]);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  const togglePerson = (person: TaggedPerson) => {
    if (selectedPeople.find((p) => p.id === person.id)) {
      setSelectedPeople(selectedPeople.filter((p) => p.id !== person.id));
    } else {
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  const handleDone = () => {
    onTagged(selectedPeople);
    onOpenChange(false);
  };

  const removePerson = (id: string) => {
    setSelectedPeople(selectedPeople.filter((p) => p.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Tag People</DialogTitle>
        </DialogHeader>

        {selectedPeople.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
            {selectedPeople.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200"
              >
                <span className="text-sm font-medium">{person.username}</span>
                <button
                  onClick={() => removePerson(person.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredUsers.map((user) => {
            const isSelected = selectedPeople.find((p) => p.id === user.id);
            return (
              <button
                key={user.id}
                onClick={() => togglePerson(user)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-gray-50 ${
                  isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                }`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    {user.isVerified && <VerifiedBadge className="w-4 h-4" />}
                  </div>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
                {isSelected && <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-gray-600">
            {selectedPeople.length} {selectedPeople.length === 1 ? 'person' : 'people'} selected
          </p>
          <Button onClick={handleDone} className="bg-emerald-500 hover:bg-emerald-600">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
