import EditorJS, { type OutputData } from '@editorjs/editorjs';
import { useEffect, useRef } from 'react';

// tools
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import Code from '@editorjs/code'
import Paragraph from '@editorjs/paragraph'

const DEFAULT_INITIAL_DATA = {
    "time": new Date().getTime(),
    "blocks": [
        {
            "type": "header",
            "data": {
                "text": "This is my awesome editor!",
                "level": 1
            }
        },
    ]
}

interface DefaultEditorProps {
    initialData?: OutputData,
    onChange?: (data: OutputData) => void,
    readOnly?: boolean
}

const DefaultEditor = ({
    initialData,
    onChange,
    readOnly
}: DefaultEditorProps) => {

    const ejInstance = useRef<EditorJS & {
        hasInitiated?: boolean
    }>(null);

    const initEditor = () => {
        ejInstance.hasInitiated = true
        const editor = new EditorJS({
            holder: 'editorjs',
            readOnly,
            onReady: () => {
                ejInstance.current = editor;
            },
            autofocus: true,
            inlineToolbar: ['link', 'marker', 'bold', 'italic'],
            tools: {
                header: Header,
                list: List,
                quote: Quote,
                code: Code,
                paragraph: Paragraph
            },
            data: initialData || DEFAULT_INITIAL_DATA,
            onChange: async () => {
                const content = await editor.saver.save();

                console.log(content);
                onChange?.(content)
            }
        });
    }

    useEffect(() => {
        if (ejInstance.current === null && !ejInstance?.hasInitiated) {
            initEditor();
        }

        return () => {
            ejInstance?.current?.destroy();
            ejInstance.current = null;
        };
    }, []);
    return (

        <div id='editorjs' className='bg-slate-100'>
        </div>
    )
}

export default DefaultEditor;