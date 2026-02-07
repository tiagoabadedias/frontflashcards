import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  UserPlus, 
  Phone,
  Eye,
  EyeOff,
  QrCode,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckSquare,
  Square,
  Grid3X3,
  List
} from 'lucide-react';
import { useGroups, useDeleteGroup, useToggleGroupStatus } from '../hooks/useGroups';
import { Group } from '../types';
import { CreateGroupModal } from '../components/CreateGroupModal';
import { EditGroupModal } from '../components/EditGroupModal';

type SortField = 'name' | 'participants' | 'isActive' | 'lastActivity';
type SortDirection = 'asc' | 'desc';

export const GroupsPage = () => {
  const navigate = useNavigate();
  
  // Estados existentes
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  // Novos estados para lista
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: groups = [], isLoading } = useGroups();
  const deleteGroupMutation = useDeleteGroup();
  const toggleStatusMutation = useToggleGroupStatus();

  // Filtros e ordenação
  const filteredAndSortedGroups = useMemo(() => {
    let filtered = groups.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           group.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === '' ||
                           (statusFilter === 'active' && group.isActive) ||
                           (statusFilter === 'inactive' && !group.isActive);

      return matchesSearch && matchesStatus;
    });

    // Ordenação
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'participants':
          aValue = a.participants.length;
          bValue = b.participants.length;
          break;
        case 'isActive':
          aValue = a.isActive ? 1 : 0;
          bValue = b.isActive ? 1 : 0;
          break;
        case 'lastActivity':
          aValue = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          bValue = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [groups, searchTerm, statusFilter, sortField, sortDirection]);

  // Paginação
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedGroups.slice(start, start + itemsPerPage);
  }, [filteredAndSortedGroups, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedGroups.length / itemsPerPage);

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' ||
                         (statusFilter === 'active' && group.isActive) ||
                         (statusFilter === 'inactive' && !group.isActive);

    return matchesSearch && matchesStatus;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const selectAllGroups = () => {
    setSelectedGroups(
      selectedGroups.length === paginatedGroups.length 
        ? [] 
        : paginatedGroups.map(g => g._id!)
    );
  };

  const handleBulkToggleStatus = async (isActive: boolean) => {
    for (const groupId of selectedGroups) {
      await toggleStatusMutation.mutateAsync({
        id: groupId,
        isActive
      });
    }
    setSelectedGroups([]);
  };

  const SortButton = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-700 hover:text-gray-900"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
      )}
      {sortField !== field && <ArrowUpDown className="w-4 h-4 opacity-30" />}
    </button>
  );

  const handleDeleteGroup = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este grupo?')) {
      await deleteGroupMutation.mutateAsync(id);
    }
  };

  const handleToggleStatus = async (group: Group) => {
    await toggleStatusMutation.mutateAsync({
      id: group._id!,
      isActive: !group.isActive
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grupos</h1>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedGroups.length} {filteredAndSortedGroups.length === 1 ? 'grupo' : 'grupos'}
            {selectedGroups.length > 0 && (
              <span className="ml-2 text-blue-600">
                • {selectedGroups.length} selecionado{selectedGroups.length > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Ações em lote */}
          {selectedGroups.length > 0 && (
            <div className="flex items-center space-x-2 mr-4">
              <button 
                onClick={() => handleBulkToggleStatus(true)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                Ativar ({selectedGroups.length})
              </button>
              <button 
                onClick={() => handleBulkToggleStatus(false)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                Desativar ({selectedGroups.length})
              </button>
            </div>
          )}
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Grupo
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar por nome ou descrição
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite para buscar..."
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos os status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
            {/* Removido o seletor de viewMode pois agora é sempre lista */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Itens por página
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Grupos */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={selectAllGroups}
                    className="flex items-center space-x-2"
                  >
                    {selectedGroups.length === paginatedGroups.length && paginatedGroups.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton field="name">Nome</SortButton>
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton field="participants">Participantes</SortButton>
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton field="isActive">Status</SortButton>
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton field="lastActivity">Última Atividade</SortButton>
                </th>
                <th className="px-4 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedGroups.map((group) => (
                <React.Fragment key={group._id}>
                  <tr className={`hover:bg-gray-50 ${selectedGroups.includes(group._id!) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleGroupSelection(group._id!)}
                        className="flex items-center"
                      >
                        {selectedGroups.includes(group._id!) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleGroupExpansion(group._id!)}
                        className="flex items-center space-x-2 text-left"
                      >
                        {expandedGroups.includes(group._id!) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{group.name}</div>
                          {group.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {group.description}
                            </div>
                          )}
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{group.participants.length}</span>
                        {group.participants.length > 0 && (
                          <div className="flex -space-x-1">
                            {group.participants.slice(0, 3).map((phone, idx) => (
                              <div
                                key={idx}
                                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white"
                              >
                                {phone.slice(-2)}
                              </div>
                            ))}
                            {group.participants.length > 3 && (
                              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white">
                                +{group.participants.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        group.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {group.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">
                        {group.updatedAt ? new Date(group.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => window.open(`/groups/${group._id}/qrcode`, '_blank')}
                          className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                          title="QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingGroup(group)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(group)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                          title={group.isActive ? 'Desativar' : 'Ativar'}
                        >
                          {group.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group._id!)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Linha expandida com detalhes */}
                  {expandedGroups.includes(group._id!) && (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Participantes ({group.participants.length})</h4>
                            <div className="flex flex-wrap gap-2">
                              {group.participants.map((phone, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                                >
                                  {phone}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Estatísticas</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Criado em:</span>
                                <div className="font-medium">
                                  {group.createdAt ? new Date(group.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Descrição:</span>
                                <div className="font-medium">
                                  {group.description || 'Sem descrição'}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Status:</span>
                                <div className="font-medium">
                                  {group.isActive ? 'Ativo' : 'Inativo'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredAndSortedGroups.length)} de {filteredAndSortedGroups.length} grupos
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (page <= totalPages) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {filteredAndSortedGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum grupo encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter 
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando um novo grupo.'}
          </p>
          {!searchTerm && !statusFilter && (
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Grupo
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modais */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingGroup && (
        <EditGroupModal
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
        />
      )}
    </div>
  );
};