
import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, Filter, Grid, List, MoreHorizontal, FileText, 
  Image as ImageIcon, UploadCloud, FolderOpen, Download, 
  Eye, Trash2, X, CheckCircle, Loader2, Plus, Calendar,
  ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Maximize2,
  Clock
} from 'lucide-react';
import { EmployeeDocument, DocVersion } from '../types';
import { DOCUMENTS_DATA } from '../mockData';

const DOC_CATEGORIES = ['All', 'Personal ID', 'Education', 'Employment', 'Tax & Compliance', 'Payroll', 'Medical', 'Legal'];

const Documents: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [documents, setDocuments] = useState<EmployeeDocument[]>(DOCUMENTS_DATA);
  
  // Upload Drawer State
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);
  const [uploadState, setUploadState] = useState({
      file: null as File | null,
      fileName: '',
      category: 'Employment',
      progress: 0,
      status: 'idle' as 'idle' | 'uploading' | 'success' | 'error'
  });

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<EmployeeDocument | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const versionInputRef = useRef<HTMLInputElement>(null);

  // Filter Logic
  const filteredDocs = useMemo(() => {
      return documents.filter(doc => {
          const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
          return matchesSearch && matchesCategory;
      });
  }, [documents, searchQuery, selectedCategory]);

  // Helpers
  const getFileIcon = (type: string) => {
    switch(type) {
        case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
        case 'jpg': case 'png': return <ImageIcon className="w-8 h-8 text-blue-500" />;
        case 'xlsx': return <Grid className="w-8 h-8 text-green-600" />;
        default: return <FileText className="w-8 h-8 text-neutral-500" />;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setUploadState(prev => ({
              ...prev,
              file,
              fileName: file.name,
              status: 'idle',
              progress: 0
          }));
      }
  };

  const handleUpload = () => {
      if (!uploadState.file) return;
      
      setUploadState(prev => ({ ...prev, status: 'uploading' }));

      // Simulate Upload
      let progress = 0;
      const interval = setInterval(() => {
          progress += 10;
          if (progress >= 100) {
              clearInterval(interval);
              
              // Create new mock doc
              const newDoc: EmployeeDocument = {
                  id: `doc-new-${Date.now()}`,
                  name: uploadState.fileName,
                  category: uploadState.category,
                  type: uploadState.file?.name.split('.').pop() as any || 'pdf',
                  size: (uploadState.file!.size / 1024 / 1024).toFixed(2) + ' MB',
                  uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  uploadedBy: 'Alexandra M.', // Current User
                  versions: [{ version: 'v1.0', date: 'Just now', user: 'Alexandra M.', size: 'Unknown' }]
              };

              setDocuments(prev => [newDoc, ...prev]);
              setUploadState(prev => ({ ...prev, status: 'success', progress: 100 }));
              
              setTimeout(() => {
                  setIsUploadDrawerOpen(false);
                  resetUpload();
              }, 1500);
          } else {
              setUploadState(prev => ({ ...prev, progress }));
          }
      }, 300);
  };

  const handleVersionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && previewDoc) {
        const file = e.target.files[0];
        
        // Calculate new version number (simple increment for mock)
        const currentVerNum = parseFloat(previewDoc.versions[0].version.replace('v', ''));
        const newVerNum = (currentVerNum + 0.1).toFixed(1);

        const newVersion: DocVersion = {
            version: `v${newVerNum}`,
            date: 'Just now',
            user: 'Alexandra M.',
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        };

        const updatedDoc = {
            ...previewDoc,
            size: newVersion.size,
            uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            uploadedBy: 'Alexandra M.',
            versions: [newVersion, ...previewDoc.versions]
        };

        // Update local state
        setDocuments(prev => prev.map(d => d.id === previewDoc.id ? updatedDoc : d));
        setPreviewDoc(updatedDoc);
    }
  };

  const resetUpload = () => {
      setUploadState({
          file: null,
          fileName: '',
          category: 'Employment',
          progress: 0,
          status: 'idle'
      });
  };

  const openPreview = (doc: EmployeeDocument) => {
      setPreviewDoc(doc);
      setZoomLevel(1);
      setRotation(0);
  };

  const closePreview = () => {
      setPreviewDoc(null);
  };

  const inputClass = "w-full px-4 py-2.5 bg-white border border-neutral-border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary transition-all placeholder:text-neutral-muted";
  const labelClass = "block text-label font-medium text-neutral-secondary mb-1.5";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-700 tracking-tight mb-2">Documents Repository</h2>
            <p className="text-neutral-secondary font-light">Centralized storage for all employee-related files.</p>
        </div>
        <div className="flex gap-2">
            <div className="flex bg-white border border-neutral-border rounded-lg p-1 shadow-sm">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-gray-700 shadow-sm' : 'text-neutral-secondary hover:text-gray-700'}`}
                >
                    <Grid className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-gray-700 shadow-sm' : 'text-neutral-secondary hover:text-gray-700'}`}
                >
                    <List className="w-4 h-4" />
                </button>
            </div>
            <button 
                onClick={() => setIsUploadDrawerOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:bg-flexi-secondary shadow-sm transition-all"
            >
                <UploadCloud className="w-4 h-4" /> Upload Document
            </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-200px)] min-h-[500px]">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 bg-white border border-neutral-border rounded-xl p-6 h-fit shadow-card">
              <h3 className="text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-3 px-2">Categories</h3>
              <div className="space-y-1">
                  {DOC_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedCategory === cat 
                            ? 'bg-flexi-light/30 text-gray-700 border border-flexi-primary/20' 
                            : 'text-neutral-secondary hover:bg-slate-100'
                        }`}
                      >
                          <div className="flex items-center gap-2">
                              <FolderOpen className={`w-4 h-4 ${selectedCategory === cat ? 'fill-blue-100' : ''}`} />
                              {cat}
                          </div>
                          {cat === 'All' && <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-neutral-muted">{documents.length}</span>}
                      </button>
                  ))}
              </div>
          </div>

          {/* Document Grid/List */}
          <div className="flex-1 flex flex-col bg-white border border-neutral-border rounded-xl shadow-card overflow-hidden">
              
              {/* Toolbar */}
              <div className="p-6 border-b border-neutral-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-100/10">
                  <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted w-4 h-4" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search files..."
                        className={inputClass + " pl-9"}
                      />
                  </div>
                  <div className="text-xs text-neutral-muted font-medium">
                      Showing {filteredDocs.length} documents
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                  {filteredDocs.length > 0 ? (
                      viewMode === 'grid' ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                              {filteredDocs.map(doc => (
                                  <div 
                                    key={doc.id} 
                                    onClick={() => openPreview(doc)}
                                    className="group relative bg-white border border-neutral-border rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-card hover:border-flexi-primary transition-all cursor-pointer"
                                  >
                                      <div className="absolute top-2 right-2  transition-opacity">
                                          <button className="p-1.5 hover:bg-slate-100 rounded-md text-neutral-muted hover:text-gray-700">
                                              <MoreHorizontal className="w-4 h-4" />
                                          </button>
                                      </div>
                                      <div className="w-16 h-16 bg-slate-100/50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                                          {getFileIcon(doc.type)}
                                      </div>
                                      <h4 className="text-sm font-semibold text-gray-700 line-clamp-2 w-full mb-1" title={doc.name}>
                                          {doc.name}
                                      </h4>
                                      <span className="text-[10px] text-neutral-secondary bg-slate-100 px-2 py-0.5 rounded border border-neutral-border mb-2">
                                          {doc.size}
                                      </span>
                                      <div className="mt-auto pt-2 border-t border-neutral-border/50 w-full flex justify-between items-center text-[10px] text-neutral-muted">
                                          <span>{doc.uploadDate}</span>
                                          <span className="bg-blue-50 text-gray-700 px-1.5 rounded">{doc.type.toUpperCase()}</span>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <table className="w-full text-left border-collapse">
                              <thead className="text-xs font-semibold text-neutral-secondary uppercase tracking-wider border-b border-neutral-border bg-slate-100/10">
                                  <tr>
                                      <th className="p-4 pl-2">Name</th>
                                      <th className="p-4">Category</th>
                                      <th className="p-4">Uploaded By</th>
                                      <th className="p-4">Date</th>
                                      <th className="p-4 text-right pr-2">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-neutral-border">
                                  {filteredDocs.map(doc => (
                                      <tr 
                                        key={doc.id} 
                                        onClick={() => openPreview(doc)}
                                        className="group hover:bg-[#F0EFF6] transition-colors cursor-pointer"
                                      >
                                          <td className="p-4 pl-2">
                                              <div className="flex items-center gap-3">
                                                  {getFileIcon(doc.type)}
                                                  <div>
                                                      <p className="text-sm font-semibold text-gray-700">{doc.name}</p>
                                                      <p className="text-xs text-neutral-muted">{doc.size}</p>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="p-4 text-sm text-neutral-secondary">{doc.category}</td>
                                          <td className="p-4 text-sm text-gray-700">{doc.uploadedBy}</td>
                                          <td className="p-4 text-sm text-neutral-secondary">{doc.uploadDate}</td>
                                          <td className="p-4 text-right pr-2">
                                              <div className="flex justify-end gap-2  transition-opacity">
                                                  <button className="p-1.5 text-neutral-muted hover:text-gray-700 hover:bg-white rounded transition-colors">
                                                      <Download className="w-4 h-4" />
                                                  </button>
                                                  <button className="p-1.5 text-neutral-muted hover:text-state-error hover:bg-white rounded transition-colors">
                                                      <Trash2 className="w-4 h-4" />
                                                  </button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      )
                  ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-neutral-muted">
                          <FolderOpen className="w-12 h-12 mb-3 opacity-20" />
                          <p>No documents found</p>
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* UPLOAD DRAWER */}
      {isUploadDrawerOpen && (
        <>
            <div 
                className="fixed inset-0 bg-neutral-primary/20 backdrop-blur-sm z-50 transition-opacity"
                onClick={() => setIsUploadDrawerOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 z-[60] w-full sm:w-[560px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-neutral-border flex flex-col">
                <div className="p-6 border-b border-neutral-border bg-slate-100/30 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-700">Upload Document</h3>
                        <p className="text-xs text-neutral-secondary">Add a new file to the repository.</p>
                    </div>
                    <button onClick={() => setIsUploadDrawerOpen(false)} className="p-2 text-neutral-secondary hover:bg-neutral-border rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    
                    {/* Drop Zone */}
                    {!uploadState.file ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-neutral-300 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-flexi-primary hover:bg-flexi-light/10 transition-all group h-64 bg-white"
                        >
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                                <UploadCloud className="w-8 h-8 text-neutral-400 group-hover:text-gray-700" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-700 mb-1">Click to upload or drag and drop</h4>
                            <p className="text-xs text-muted max-w-[200px]">
                                PDF, DOCX, JPG, PNG or XLSX (max. 10MB)
                            </p>
                            <button className="px-6 py-3 bg-primary text-[#F4B299] font-bold rounded-xl shadow-md  transition-colors pointer-events-none">
                                Select File
                            </button>
                            <input 
                                type="file" 
                                className="hidden" 
                                ref={fileInputRef} 
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e)}
                            />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* File Preview Card */}
                            <div className="flex items-center gap-4 p-4 border border-neutral-border rounded-xl bg-slate-100/20">
                                <div className="w-12 h-12 bg-white rounded-lg border border-neutral-border flex items-center justify-center shadow-sm">
                                    <FileText className="w-6 h-6 text-gray-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-700 truncate">{uploadState.file.name}</p>
                                    <p className="text-xs text-neutral-secondary">{(uploadState.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button 
                                    onClick={resetUpload} 
                                    className="p-2 text-neutral-muted hover:text-state-error transition-colors"
                                    disabled={uploadState.status === 'uploading'}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Metadata Form */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Display Name</label>
                                    <input 
                                        type="text" 
                                        value={uploadState.fileName}
                                        onChange={(e) => setUploadState({...uploadState, fileName: e.target.value})}
                                        className={inputClass}
                                        disabled={uploadState.status !== 'idle'}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Category</label>
                                    <select 
                                        value={uploadState.category}
                                        onChange={(e) => setUploadState({...uploadState, category: e.target.value})}
                                        className={inputClass + " appearance-none bg-white"}
                                        disabled={uploadState.status !== 'idle'}
                                    >
                                        {DOC_CATEGORIES.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {uploadState.status !== 'idle' && (
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className={uploadState.status === 'error' ? 'text-state-error' : 'text-gray-700'}>
                                            {uploadState.status === 'uploading' ? 'Uploading...' : uploadState.status === 'success' ? 'Upload Complete' : 'Error'}
                                        </span>
                                        <span>{uploadState.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-300 ${uploadState.status === 'success' ? 'bg-state-success' : 'bg-flexi-primary'}`} 
                                            style={{ width: `${uploadState.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-neutral-border bg-slate-100/30 flex gap-3">
                    <button 
                        onClick={() => setIsUploadDrawerOpen(false)}
                        className="flex-1 px-4 py-3 bg-white border border-neutral-border text-gray-700 font-bold rounded-lg hover:bg-slate-100 transition-colors text-sm"
                        disabled={uploadState.status === 'uploading'}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleUpload}
                        disabled={!uploadState.file || uploadState.status !== 'idle'}
                        className="flex-[2] px-4 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-flexi-secondary transition-colors text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {uploadState.status === 'uploading' ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Uploading
                            </>
                        ) : uploadState.status === 'success' ? (
                            <>
                                <CheckCircle className="w-4 h-4" /> Done
                            </>
                        ) : (
                            'Upload Document'
                        )}
                    </button>
                </div>
            </div>
        </>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/90 backdrop-blur-sm p-0 !m-0 md:p-6 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-6xl h-full rounded-2xl shadow-2xl flex overflow-hidden">
                
                {/* Main Preview Area */}
                <div className="flex-1 bg-neutral-100 relative flex flex-col">
                    {/* Toolbar */}
                    <div className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-6 z-10">
                        <div className="flex items-center gap-4">
                            <h3 className="font-bold text-gray-700 truncate max-w-[200px] md:max-w-md">{previewDoc.name}</h3>
                            <span className="text-xs bg-neutral-100 px-2 py-1 rounded text-neutral-500 font-mono uppercase border border-neutral-200">
                                {previewDoc.type}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                                className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-5 h-5" />
                            </button>
                            <span className="text-xs font-mono text-neutral-500 w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                            <button 
                                onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                                className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </button>
                            <div className="w-px h-6 bg-neutral-200 mx-2"></div>
                            <button 
                                onClick={() => setRotation(prev => prev + 90)}
                                className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors"
                                title="Rotate"
                            >
                                <RotateCw className="w-5 h-5" />
                            </button>
                            <button 
                                className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors"
                                title="Download"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                            <button onClick={closePreview} className="ml-4 p-2 bg-neutral-100 hover:bg-red-50 text-neutral-500 hover:text-state-error rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Canvas / Viewport */}
                    <div className="flex-1 overflow-auto flex items-center justify-center p-2 bg-neutral-100/50">
                        <div 
                            className="relative shadow-xl transition-transform duration-200 ease-out origin-center bg-white"
                            style={{ 
                                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                                width: previewDoc.type === 'pdf' ? '595px' : 'auto', 
                                height: previewDoc.type === 'pdf' ? '842px' : 'auto',
                                maxWidth: '100%',
                                maxHeight: '100%'
                            }}
                        >
                            {previewDoc.type === 'pdf' ? (
                                // Mock PDF Viewer
                                <div className="w-full h-full bg-white flex flex-col">
                                    <div className="flex-1 p-12 text-neutral-800">
                                        <div className="h-4 w-32 bg-neutral-200 mb-8"></div>
                                        <div className="space-y-4">
                                            <div className="h-2 w-full bg-neutral-100"></div>
                                            <div className="h-2 w-full bg-neutral-100"></div>
                                            <div className="h-2 w-3/4 bg-neutral-100"></div>
                                            <div className="h-2 w-full bg-neutral-100"></div>
                                            <div className="h-2 w-5/6 bg-neutral-100"></div>
                                        </div>
                                        <div className="mt-12 p-6 bg-blue-50/50 border border-blue-100 rounded-lg text-center">
                                            <p className="text-sm text-gray-700 font-medium">PDF Preview Simulation</p>
                                            <p className="text-xs text-neutral-500 mt-1">Real rendering requires PDF.js integration</p>
                                        </div>
                                    </div>
                                    <div className="h-8 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between px-4 text-[10px] text-neutral-400">
                                        <span>Page 1 of 3</span>
                                        <span>Flexi HRMS</span>
                                    </div>
                                </div>
                            ) : (
                                // Image Viewer
                                <img 
                                    src={`https://picsum.photos/seed/${previewDoc.id}/800/1000`} 
                                    alt="Preview"
                                    className="max-w-none object-contain block"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Metadata */}
                <div className="w-80 bg-white border-l border-neutral-border flex flex-col shrink-0">
                    <div className="p-6 border-b border-neutral-border">
                        <h4 className="font-bold text-gray-700 mb-4">Document Details</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-neutral-secondary uppercase tracking-wider mb-1">Uploaded By</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-600">
                                        {previewDoc.uploadedBy.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{previewDoc.uploadedBy}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-neutral-secondary uppercase tracking-wider mb-1">Size</p>
                                    <p className="text-sm font-mono text-gray-700">{previewDoc.size}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-secondary uppercase tracking-wider mb-1">Date</p>
                                    <p className="text-sm text-gray-700">{previewDoc.uploadDate}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-secondary uppercase tracking-wider mb-1">Category</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-gray-700 border border-blue-100">
                                    {previewDoc.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-neutral-400" /> Version History
                            </h4>
                            <button 
                                onClick={() => versionInputRef.current?.click()}
                                className="text-[10px] font-bold text-gray-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                            >
                                <UploadCloud className="w-3 h-3" /> New Version
                            </button>
                            <input 
                                type="file" 
                                className="hidden" 
                                ref={versionInputRef}
                                onChange={handleVersionUpload}
                            />
                        </div>
                        <div className="relative pl-2 space-y-6">
                            <div className="absolute top-2 bottom-2 left-[5px] w-px bg-neutral-border"></div>
                            {previewDoc.versions.map((ver, i) => (
                                <div key={i} className="relative pl-5 group">
                                    <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm z-10 ${i === 0 ? 'bg-flexi-primary' : 'bg-neutral-300'}`}></div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className={`text-sm font-bold ${i === 0 ? 'text-gray-700' : 'text-neutral-secondary'}`}>
                                                {ver.version}
                                            </p>
                                            <p className="text-xs text-neutral-muted mt-0.5">by {ver.user}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-700 font-medium">{ver.date}</p>
                                            <button className="text-[10px] text-gray-700 hover:underline  transition-opacity">Download</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-t border-neutral-border bg-neutral-50">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 bg-white text-state-error text-sm font-bold rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" /> Delete File
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Documents;
