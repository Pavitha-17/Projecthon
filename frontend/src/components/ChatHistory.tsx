import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import {useState} from 'react';

type InputProps = {
  isOpen: boolean;
  SIDEBAR_COLLAPSED: number;
  SIDEBAR_EXPANDED: number;
  chat:String,
  recentMessage:String,
  isClicked:number,
  setIsClicked:Function,
  index:number,
};

function ChatHistory({
  isOpen,
  SIDEBAR_COLLAPSED,
  SIDEBAR_EXPANDED,
  chat,
  recentMessage,
  isClicked,
  setIsClicked,
  index,
}: InputProps) {
  return (
    <Pressable
      style={[
        {
          width: isOpen ? SIDEBAR_EXPANDED - 15 : SIDEBAR_COLLAPSED - 15,
        },
      ]}
      onPress={()=>setIsClicked(index + 2)}
    >
      <View
        style={[
          styles.historyContainer,
          {
            borderWidth: 1,
            borderColor: isClicked === index+2?"#dd96f7ff":"lightgrey",
            paddingVertical: 10,
            backgroundColor:isClicked === index+2?"#f9eefdff":"#fff",
          },
        ]}
      >
        <MessageCircle color={ isClicked === index+2?"#dd96f7ff":"black"} size={25} strokeWidth={1} />
        {isOpen && 
        (<View>
        <Text style={{ color: 'black'}}>{chat}</Text>
        <Text style={{ color: 'black',fontSize:10 }}>{recentMessage}</Text>
        <Text style={{ color: 'black',fontSize:10,position:'absolute',right:0 }}>Now</Text>
        </View>
        )
        }
      </View>
    </Pressable>
  );
}

export default ChatHistory;

const styles = StyleSheet.create({
  historyContainer: {
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    gap: 20,
  },
});
