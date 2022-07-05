import { useState } from 'react';
import { schema } from 'prosemirror-schema-basic';
import { EditorState } from "prosemirror-state";
import { exampleSetup } from "prosemirror-example-setup";
import { syncPlugin } from './lib/textEditor/plugins/sync.controller';
import ProseMirror from './lib/textEditor/ProseMirror';
import { getColor } from './lib/textEditor/utils/getColor';
import { getName } from './lib/textEditor/utils/getName';
import { SocketConnection } from './lib/textEditor/utils/SocketConnection';

const TextEditor = () => {
    const [state, setState] = useState(() => EditorState.create({ schema, plugins: exampleSetup({ schema }).concat(syncPlugin) }))
    const [usersState, setUsersState] = useState<{ color: string, name: string, id: string }[]>(() => []);

    const socket = SocketConnection.getInstance();

    socket.on('userConnected', (result) => {
        const newUsersState = [...usersState];
        newUsersState.push({ color: getColor(result.id), name: getName(result.id), id: result.id });
        setUsersState(newUsersState);
    });


    socket.on('restoreContent', (result) => {
        const newUsers = result.users.filter((user) => {
            return user.id != result.id
        }).map((user) => {
            return {
                color: getColor(user.id), name: getName(user.id), id: user.id
            }
        });
        setUsersState(newUsers)
    });

    socket.on('userDisconnected', (result) => {
        console.log(result);
        const newUsers = usersState.filter((user) => {
            return user.id != result.id
        });

        setUsersState(newUsers)
    });



    return (
        <>
            <div className='Header'>
                <div className='DocTitle'>
                    {"File name"}
                </div>

                <div className='Users'>
                    {usersState.filter((data, index) => index < 5).map((user: any) => {
                        return <div style={{ borderColor: user.color }} className="User" key={user.id} >{user.name[0]}</div>
                    })}
                </div>
            </div>
            <ProseMirror state={state} onChange={setState} />
        </>
    )
};

export default TextEditor;