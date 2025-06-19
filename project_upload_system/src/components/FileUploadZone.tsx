'use client'

import { Monitor, Zap, Printer, Upload, CheckCircle, AlertCircle, File, X } from 'lucide-react';
import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import clsx from 'clsx';

type DeviceType = '3d-printer' | 'laser-cutter' | 'pcb-printer';
type ProjectPriority = 'school' | 'personal'

interface UploadedFile {
    file: File
    id: string
    preview?: string
}

const DEVICE_TYPES = [
    { id: '3d-printer' as const, name: '3D Printer', icon: Monitor, description: 'PLA, ABS, PETG materials' },
    { id: 'laser-cutter' as const, name: 'Laser Cutter', icon: Zap, description: 'Acrylic, wood, paper cutting' },
    { id: 'pcb-printer' as const, name: 'PCB Printer', icon: Printer, description: 'Circuit board boards' },
]

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ACCEPTED_FILE_TYPES = {
    '3d-printer': ['.stl', '.obj', '.gcode'],
    'laser-cutter': ['.svg', '.dxf', '.pdf'],
    'pcb-printer': ['.gerber', '.gbr', '.zip']
}

export default function FileUploadZone() {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [deviceType, setDeviceType] = useState<DeviceType>('3d-printer');
    const [priority, setPriority] = useState<ProjectPriority>('personal');
    const [isDragOver, setIsDragOver] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): string | null => {
        if (file.size > MAX_FILE_SIZE) {
            return `File "${file.name}" size exceeds the limit of ${MAX_FILE_SIZE / 1024 / 1024} MB.`;
        }

        const acceptedTypes = ACCEPTED_FILE_TYPES[deviceType];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

        if (!acceptedTypes.includes(fileExtension)) {
            return `File "${file.name}" is not supported for ${DEVICE_TYPES.find(d => d.id === deviceType)?.name}. Accepted types: ${acceptedTypes.join(', ')}.`;
        }

        return null;
    }

    const handleFiles = useCallback((newFiles: FileList | null) => {
        if (!newFiles) return

        setError(null)
        const validFiles: UploadedFile[] = []

        Array.from(newFiles).forEach(file => {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                return
            }

            validFiles.push({
                file,
                id: Math.random().toString(36).substring(2, 9),
            })
        })

        setFiles(prev => [...prev, ...validFiles]);
    }, [deviceType]);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, [])

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, [])

    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleFiles(e.target.files);
        e.target.value = ''; // Reset input value to allow re-uploading the same file
    }, [handleFiles]);

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(file => file.id !== id));
    }

    const handleSubmit = async () => {
        if (files.length === 0) {
            setError('Please upload at least one file.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // TODO: Implement the actual upload logic here with Fastify API
            const formData = new FormData()
            files.forEach(({ file }) => {
                formData.append('files', file)
            })
            formData.append('deviceType', deviceType)
            formData.append('priority', priority)

            console.log('Submitting files:', files.map(f => f.file.name))
            console.log('Device type:', deviceType)
            console.log('Priority:', priority)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Reset form on success
            setFiles([])
            alert('Project submitted successfully! You will receive updates on Discord.')
        } catch (err) {
            setError('Failed to submit project. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="space-y-6">
            {/* Device Selection */}
            <div className="glass-effect rounded-xl p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Select Device Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {DEVICE_TYPES.map((device) => {
                        const Icon = device.icon
                        return (
                            <button
                                key={device.id}
                                onClick={() => setDeviceType(device.id)}
                                className={clsx(
                                    'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                                    deviceType === device.id
                                        ? 'border-primary-500 bg-primary-50 shadow-md'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                )}
                            >
                                <div className="flex items-center space-x-3 mb-2">
                                    <Icon className={clsx(
                                        'h-6 w-6',
                                        deviceType === device.id ? 'text-primary-600' : 'text-slate-600'
                                    )} />
                                    <span className="font-medium text-slate-800">{device.name}</span>
                                </div>
                                <p className="text-sm text-slate-600">{device.description}</p>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Priority Selection */}
            <div className="glass-effect rounded-xl p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Project Priority</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setPriority('school')}
                        className={clsx(
                            'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
                            priority === 'school'
                                ? 'bg-warning-100 text-warning-800 border-2 border-warning-300 shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-transparent'
                        )}
                    >
                        School Project
                    </button>
                    <button
                        onClick={() => setPriority('personal')}
                        className={clsx(
                            'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
                            priority === 'personal'
                                ? 'bg-primary-100 text-primary-800 border-2 border-primary-300 shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-transparent'
                        )}
                    >
                        Personal Project
                    </button>
                </div>
            </div>

            {/* File Upload Zone */}
            <div className="glass-effect rounded-xl p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Upload Project Files</h2>

                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={clsx(
                        'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
                        isDragOver
                            ? 'border-primary-400 bg-primary-50 scale-105'
                            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                    )}
                >
                    <Upload className={clsx(
                        'mx-auto h-12 w-12 mb-4',
                        isDragOver ? 'text-primary-500 animate-bounce-gentle' : 'text-slate-400'
                    )} />

                    <div className="space-y-2">
                        <p className="text-lg font-medium text-slate-700">
                            Drop your files here, or{' '}
                            <label className="text-primary-600 hover:text-primary-700 cursor-pointer underline">
                                browse
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileInput}
                                    accept={ACCEPTED_FILE_TYPES[deviceType].join(',')}
                                    className="hidden"
                                />
                            </label>
                        </p>
                        <p className="text-sm text-slate-500">
                            Accepted formats: {ACCEPTED_FILE_TYPES[deviceType].join(', ')}
                        </p>
                        <p className="text-xs text-slate-400">Maximum file size: 50MB</p>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-error-500 flex-shrink-0" />
                        <span className="text-error-700">{error}</span>
                    </div>
                )}

                {/* Uploaded Files List */}
                {files.length > 0 && (
                    <div className="mt-6 space-y-3">
                        <h3 className="font-medium text-slate-800">Uploaded Files ({files.length})</h3>
                        {files.map(({ file, id }) => (
                            <div key={id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                <div className="flex items-center space-x-3">
                                    <File className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-700">{file.name}</p>
                                        <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(id)}
                                    className="p-1 text-slate-400 hover:text-error-500 transition-colors duration-200"
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={files.length === 0 || isSubmitting}
                        className={clsx(
                            'px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2',
                            files.length === 0 || isSubmitting
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                : 'button-primary hover:shadow-lg'
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                <span>Submit Project</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}