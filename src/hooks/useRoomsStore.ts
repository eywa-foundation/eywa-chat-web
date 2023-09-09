import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Room } from '../pages/List/useList';

interface RoomsState {
  rooms: Room[];
  addRoom: (room: Room) => void;
  addChat: (roomId: string, message: string) => void;
}

const useRoomsStore = create<RoomsState>()(
  persist(
    (set) => ({
      rooms: [],
      addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
      addChat: (roomId, message) =>
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.roomId === roomId
              ? {
                  ...room,
                  messages: [
                    ...room.messages,
                    { message, timestamp: Date.now() },
                  ],
                }
              : room,
          ),
        })),
    }),
    {
      name: 'rooms',
    },
  ),
);

export default useRoomsStore;
