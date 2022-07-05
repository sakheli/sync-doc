import { Plugin, TextSelection } from 'prosemirror-state';
import { Node } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic';
import { throttle } from '../utils/throttle';
import { getColor } from '../utils/getColor';
import { getName } from '../utils/getName';
import { SocketConnection } from '../utils/SocketConnection';

export const syncPlugin = new Plugin({
    view(editorView) { return new SyncTool(editorView); }
});

interface cursor {
    color: string,
    name: string,
    cursorElement: HTMLDivElement
}

export class SyncTool {
    private cursors: Map<string, cursor>;
    private shouldSendUpdate = false;
    throttleSendUpdate;
    private editorView;


    constructor(view) {
        this.editorView = view;
        this.cursors = new Map();
        const socket = SocketConnection.getInstance();
        
        socket.emit('userConnected', this.editorView.state.selection.toJSON());      
        // socket.emit('userConnected');      

        this.throttleSendUpdate = throttle(() => {
            socket.emit('updateContent', this.editorView.state.toJSON());        
        }, 500);

        socket.on('userConnected', (result) => {            
            this.createCursor(result.id);
            this.setCursor(result.selection, result.id)
        });

        socket.on('restoreContent', (result) => {
            this.restoreContent(result);
        });

        socket.on('updateContent', (result) => {
            this.getUpdate(result);
        });

        socket.on('userDisconnected', (result) => {
            this.destroyCursor(result.id);
        });
    }

    update(view, lastState) {
        let state = view.state;
        if (lastState && lastState.doc.eq(state.doc) &&
            lastState.selection.eq(state.selection)) return;

        if(this.shouldSendUpdate) 
            this.sendUpdate();
    }

    sendUpdate() {
        this.throttleSendUpdate();
    }

    getUpdate(result, updateCursor = true) {
        // todo : write error handling
        if(result.doc === undefined) return;
        if(updateCursor)
            setTimeout(() => {
                this.setCursor(result.selection, result.id);
            }, 500);
        
        let state = this.editorView.state;
        let tr = state.tr;
        
        let newNode = Node.fromJSON(schema, result.doc);
        
        const {from, to} = state.selection;
        
        tr = state.tr.replaceWith(0, state.doc.content.size, newNode);
        
        try {
            tr.setSelection(
                TextSelection.create(
                    state.apply(tr).doc,
                    from, to
                )
            );
        } catch (error) {
            
        }
        this.editorView.dispatch(tr);
    }

    restoreContent(result) {
        if(result.content === undefined || result.content === null) { 
            this.shouldSendUpdate = true;
            return;
        }
        this.getUpdate(result.content, false);

        setTimeout(() => {
            for (let i = 0; i < result.users.length; i++) {
                const user = result.users[i];
                
                if(user.id === result.id) 
                    continue;
                this.createCursor(user.id);
                this.setCursor(user.selection, user.id);
            }
            this.shouldSendUpdate = true;
        }, 1000);
    }


    createCursor(id) {
        let color = getColor(id);
        let name = getName(id);
        let cursor = document.createElement('div');
        cursor.className = 'tooltip';
        cursor.style.border = `2px solid ${color}`;
        cursor.style.backgroundColor = color;
        cursor.dataset.name = name;
        
        this.editorView.dom.parentNode.appendChild(cursor);
        this.cursors.set(id, {
            name: name,
            color: color,
            cursorElement: cursor
        })
    }

    setCursor(selection, id) {
        // todo: write cursor setting 
        const cursorElement = this.cursors.get(id)?.cursorElement;
        if(cursorElement === undefined || cursorElement.offsetParent === null) return;

        const from  = Math.min(this.editorView.state.doc.content.size, selection.head);
        const start = this.editorView.coordsAtPos(from||1);        
        const box = cursorElement.offsetParent.getBoundingClientRect();
        cursorElement.style.bottom = (box.bottom - start.top - 20) + 'px';
        const left = Math.max(start.left, start.left);
        cursorElement.style.left = (left - box.left) + 'px';
    }

    destroyCursor(id: string) {
        this.cursors.get(id)?.cursorElement.remove();
        this.cursors.delete(id);
    }

    destroy() { 
        
    }
}

