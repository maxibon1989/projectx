'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { PageLayout } from '@/components/layout';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  Input,
  TextArea,
  Badge,
  EmptyState,
} from '@/components/ui';
import { House, Room, RoomType } from '@/types';
import { generateId, createDefaultArrivalChecklist, createDefaultDepartureChecklist } from '@/lib/utils';
import {
  FiHome,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiGrid,
  FiUsers,
  FiList,
} from 'react-icons/fi';

const roomTypes: { value: RoomType; label: string }[] = [
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'guest_room', label: 'Guest Room' },
  { value: 'living_room', label: 'Living Room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'office', label: 'Office' },
  { value: 'storage', label: 'Storage' },
  { value: 'other', label: 'Other' },
];

export default function HousesPage() {
  const { state, dispatch } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Form states
  const [houseName, setHouseName] = useState('');
  const [houseAddress, setHouseAddress] = useState('');
  const [houseNickname, setHouseNickname] = useState('');
  const [houseRules, setHouseRules] = useState('');

  // Room form states
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<RoomType>('bedroom');
  const [roomCapacity, setRoomCapacity] = useState('2');
  const [roomNotes, setRoomNotes] = useState('');

  const resetHouseForm = () => {
    setHouseName('');
    setHouseAddress('');
    setHouseNickname('');
    setHouseRules('');
  };

  const resetRoomForm = () => {
    setRoomName('');
    setRoomType('bedroom');
    setRoomCapacity('2');
    setRoomNotes('');
    setEditingRoom(null);
  };

  const handleAddHouse = () => {
    if (!houseName.trim()) return;

    const newHouse: House = {
      id: generateId(),
      familyGroupId: state.familyGroup?.id || '',
      name: houseName.trim(),
      address: houseAddress.trim() || undefined,
      nickname: houseNickname.trim() || undefined,
      photos: [],
      rules: houseRules
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      rooms: [],
      defaultArrivalChecklist: createDefaultArrivalChecklist(),
      defaultDepartureChecklist: createDefaultDepartureChecklist(),
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_HOUSE', payload: newHouse });
    resetHouseForm();
    setShowAddModal(false);
  };

  const handleEditHouse = () => {
    if (!selectedHouse || !houseName.trim()) return;

    const updatedHouse: House = {
      ...selectedHouse,
      name: houseName.trim(),
      address: houseAddress.trim() || undefined,
      nickname: houseNickname.trim() || undefined,
      rules: houseRules
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
    };

    dispatch({ type: 'UPDATE_HOUSE', payload: updatedHouse });
    resetHouseForm();
    setSelectedHouse(null);
    setShowEditModal(false);
  };

  const handleDeleteHouse = (houseId: string) => {
    if (confirm('Are you sure you want to delete this house? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_HOUSE', payload: houseId });
    }
  };

  const openEditModal = (house: House) => {
    setSelectedHouse(house);
    setHouseName(house.name);
    setHouseAddress(house.address || '');
    setHouseNickname(house.nickname || '');
    setHouseRules(house.rules.join('\n'));
    setShowEditModal(true);
  };

  const handleAddRoom = () => {
    if (!selectedHouse || !roomName.trim()) return;

    const newRoom: Room = {
      id: generateId(),
      houseId: selectedHouse.id,
      name: roomName.trim(),
      type: roomType,
      capacity: parseInt(roomCapacity) || 0,
      notes: roomNotes.trim() || undefined,
    };

    dispatch({ type: 'ADD_ROOM', payload: { houseId: selectedHouse.id, room: newRoom } });
    resetRoomForm();
    setShowRoomModal(false);
  };

  const handleEditRoom = () => {
    if (!selectedHouse || !editingRoom || !roomName.trim()) return;

    const updatedRoom: Room = {
      ...editingRoom,
      name: roomName.trim(),
      type: roomType,
      capacity: parseInt(roomCapacity) || 0,
      notes: roomNotes.trim() || undefined,
    };

    dispatch({ type: 'UPDATE_ROOM', payload: { houseId: selectedHouse.id, room: updatedRoom } });
    resetRoomForm();
    setShowRoomModal(false);
  };

  const handleDeleteRoom = (houseId: string, roomId: string) => {
    if (confirm('Delete this room?')) {
      dispatch({ type: 'DELETE_ROOM', payload: { houseId, roomId } });
    }
  };

  const openRoomModal = (house: House, room?: Room) => {
    setSelectedHouse(house);
    if (room) {
      setEditingRoom(room);
      setRoomName(room.name);
      setRoomType(room.type);
      setRoomCapacity(room.capacity.toString());
      setRoomNotes(room.notes || '');
    } else {
      resetRoomForm();
    }
    setShowRoomModal(true);
  };

  return (
    <PageLayout title="Houses">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500">
              Manage your family's shared homes
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            Add House
          </Button>
        </div>

        {/* Houses List */}
        {state.houses.length === 0 ? (
          <EmptyState
            icon={<FiHome className="w-8 h-8" />}
            title="No houses yet"
            description="Add your first house to get started with coordinating stays."
            actionLabel="Add House"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <div className="space-y-4">
            {state.houses.map((house) => (
              <Card key={house.id}>
                <CardBody className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {house.name}
                      </h3>
                      {house.nickname && (
                        <p className="text-sm text-slate-500">{house.nickname}</p>
                      )}
                      {house.address && (
                        <p className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                          <FiMapPin className="w-3 h-3" />
                          {house.address}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(house)}
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteHouse(house.id)}
                      >
                        <FiTrash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <FiGrid className="w-4 h-4" />
                      {house.rooms.length} rooms
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <FiList className="w-4 h-4" />
                      {house.rules.length} rules
                    </div>
                  </div>

                  {/* Rooms */}
                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-slate-700">Rooms</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openRoomModal(house)}
                      >
                        <FiPlus className="w-4 h-4 mr-1" />
                        Add Room
                      </Button>
                    </div>

                    {house.rooms.length === 0 ? (
                      <p className="text-sm text-slate-400">No rooms added yet</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {house.rooms.map((room) => (
                          <div
                            key={room.id}
                            className="bg-slate-50 rounded-lg p-3 group"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-slate-800 text-sm">
                                  {room.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {roomTypes.find((t) => t.value === room.type)?.label}
                                </p>
                                {room.capacity > 0 && (
                                  <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                                    <FiUsers className="w-3 h-3" />
                                    {room.capacity}
                                  </p>
                                )}
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button
                                  onClick={() => openRoomModal(house, room)}
                                  className="p-1 hover:bg-slate-200 rounded"
                                >
                                  <FiEdit2 className="w-3 h-3 text-slate-500" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRoom(house.id, room.id)}
                                  className="p-1 hover:bg-slate-200 rounded"
                                >
                                  <FiTrash2 className="w-3 h-3 text-red-500" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add House Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetHouseForm();
        }}
        title="Add New House"
        size="md"
      >
        <div className="p-4 space-y-4">
          <Input
            label="House Name"
            placeholder="e.g., Lake House"
            value={houseName}
            onChange={(e) => setHouseName(e.target.value)}
          />
          <Input
            label="Address"
            placeholder="e.g., 123 Main St, City, State"
            value={houseAddress}
            onChange={(e) => setHouseAddress(e.target.value)}
          />
          <Input
            label="Nickname (optional)"
            placeholder="e.g., The Lake Place"
            value={houseNickname}
            onChange={(e) => setHouseNickname(e.target.value)}
          />
          <TextArea
            label="House Rules (one per line)"
            placeholder="No shoes inside&#10;Quiet hours after 10 PM"
            rows={4}
            value={houseRules}
            onChange={(e) => setHouseRules(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                resetHouseForm();
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={handleAddHouse} fullWidth disabled={!houseName.trim()}>
              Add House
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit House Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedHouse(null);
          resetHouseForm();
        }}
        title="Edit House"
        size="md"
      >
        <div className="p-4 space-y-4">
          <Input
            label="House Name"
            placeholder="e.g., Lake House"
            value={houseName}
            onChange={(e) => setHouseName(e.target.value)}
          />
          <Input
            label="Address"
            placeholder="e.g., 123 Main St, City, State"
            value={houseAddress}
            onChange={(e) => setHouseAddress(e.target.value)}
          />
          <Input
            label="Nickname (optional)"
            placeholder="e.g., The Lake Place"
            value={houseNickname}
            onChange={(e) => setHouseNickname(e.target.value)}
          />
          <TextArea
            label="House Rules (one per line)"
            placeholder="No shoes inside&#10;Quiet hours after 10 PM"
            rows={4}
            value={houseRules}
            onChange={(e) => setHouseRules(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setSelectedHouse(null);
                resetHouseForm();
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={handleEditHouse} fullWidth disabled={!houseName.trim()}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Room Modal */}
      <Modal
        isOpen={showRoomModal}
        onClose={() => {
          setShowRoomModal(false);
          setSelectedHouse(null);
          resetRoomForm();
        }}
        title={editingRoom ? 'Edit Room' : 'Add Room'}
        size="md"
      >
        <div className="p-4 space-y-4">
          <Input
            label="Room Name"
            placeholder="e.g., Master Bedroom"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as RoomType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {roomTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Capacity"
            type="number"
            min="0"
            placeholder="e.g., 2"
            value={roomCapacity}
            onChange={(e) => setRoomCapacity(e.target.value)}
          />
          <TextArea
            label="Notes (optional)"
            placeholder="e.g., King bed, ensuite bathroom"
            rows={2}
            value={roomNotes}
            onChange={(e) => setRoomNotes(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRoomModal(false);
                setSelectedHouse(null);
                resetRoomForm();
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={editingRoom ? handleEditRoom : handleAddRoom}
              fullWidth
              disabled={!roomName.trim()}
            >
              {editingRoom ? 'Save Changes' : 'Add Room'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}
