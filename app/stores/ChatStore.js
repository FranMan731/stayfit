import {observable} from 'mobx'

class ChatStore {
   @observable chats

   setChats(value) {
      this.chats = value
   }

   setLastMessage(id_chat, message) {
      const index = this.chats.findIndex(x => x._id === id_chat)
      this.chats[index].last_message = message
   }

   removeDot(id_chat) {
      const index = this.chats.findIndex(x => x._id === id_chat)
      this.chats[index].nuevo = true
   }
}

export default new ChatStore()