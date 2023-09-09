import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Room } from '../pages/List/useList';

interface RoomsState {
  rooms: Pick<Room, 'opponent' | 'roomId' | 'server'>[];
  addRoom: (room: Room) => void;
}

const useRoomsStore = create<RoomsState>()(
  persist(
    (set) => ({
      rooms: [],
      addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
    }),
    {
      name: 'rooms',
    },
  ),
);

export default useRoomsStore;
