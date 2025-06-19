import { Wrench, Monitor, Zap } from 'lucide-react';

export default function Header() {
    return (
        <header className='glass-effect border-b'>
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-primary-600 p-2 rounded-lg">
                            <Wrench className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">
                                Innovation Lab
                            </h1>
                            <p className="text-sm text-slate-600">
                                Print Management System
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-sm text-slate-800">
                            <Monitor className="w-4 h-4" />
                            <span>3D Printing</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Zap className="w-4 h-4" />
                            <span>Laser Cutting</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Wrench className="text-primary-600 w-4 h-4" />
                            <span>PCB Fabrication</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
