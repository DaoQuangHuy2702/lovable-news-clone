import { useRef, useMemo, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import 'react-quill/dist/quill.snow.css';

// DO NOT import Quill or ReactQuill at top level
// This prevents Vite from evaluating them during build-time transformation

interface QuillEditorProps {
    value: string;
    onChange: (content: string) => void;
    imageHandler: () => void;
    videoHandler: () => void;
}

export interface QuillEditorHandle {
    getEditor: () => any;
}

const QuillEditor = forwardRef<QuillEditorHandle, QuillEditorProps>(({ value, onChange, imageHandler, videoHandler }, ref) => {
    const [Editor, setEditor] = useState<any>(null);
    const [quillInstance, setQuillInstance] = useState<any>(null);
    const quillRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        getEditor: () => quillRef.current?.getEditor()
    }));

    useEffect(() => {
        const loadQuill = async () => {
            if (typeof window !== 'undefined') {
                try {
                    // Import libraries dynamically only in the browser
                    const [ReactQuillModule, QuillModule, ImageResizeModule] = await Promise.all([
                        import('react-quill'),
                        import('quill'),
                        import('quill-image-resize-module-react')
                    ]);

                    const RQ = ReactQuillModule.default || ReactQuillModule;
                    const Q = QuillModule.default || QuillModule;
                    const IR = ImageResizeModule.default || ImageResizeModule;

                    // Register module
                    try {
                        if (!Q.import('modules/imageResize')) {
                            Q.register('modules/imageResize', IR);
                        }
                    } catch (e) {
                        Q.register('modules/imageResize', IR);
                    }

                    setQuillInstance(Q);
                    setEditor(() => RQ);
                } catch (error) {
                    console.error("Failed to load Quill or ImageResize:", error);
                }
            }
        };
        loadQuill();
    }, []);

    const modules = useMemo(() => {
        if (!quillInstance) return null;

        return {
            toolbar: {
                container: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['link', 'image', 'video', 'clean']
                ],
                handlers: {
                    image: imageHandler,
                    video: videoHandler
                }
            },
            imageResize: {
                parchment: quillInstance.import('parchment'),
                modules: ['Resize', 'DisplaySize']
            }
        };
    }, [quillInstance, imageHandler, videoHandler]);

    if (!Editor || !modules) {
        return <div className="h-[350px] w-full bg-muted animate-pulse rounded-md" />;
    }

    const ReactQuillComponent = Editor;

    return (
        <ReactQuillComponent
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            className="quill h-[300px]"
            modules={modules}
        />
    );
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;
