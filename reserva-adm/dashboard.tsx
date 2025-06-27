"use client"

import { useState } from "react"
import { Calendar, Eye, Edit, Trash2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Dados de exemplo
const reservasData = [
  {
    id: 1,
    dataReserva: "2024-01-15",
    horaReserva: "09:00",
    solicitante: "João Silva",
    setor: "TI",
    empresa: "Tech Corp",
    situacao: "Confirmada",
  },
  {
    id: 2,
    dataReserva: "2024-01-16",
    horaReserva: "14:30",
    solicitante: "Maria Santos",
    setor: "RH",
    empresa: "Inovação Ltda",
    situacao: "Pendente",
  },
  {
    id: 3,
    dataReserva: "2024-01-17",
    horaReserva: "10:15",
    solicitante: "Pedro Costa",
    setor: "Vendas",
    empresa: "Comercial SA",
    situacao: "Cancelada",
  },
]

type Reserva = {
  id: number
  dataReserva: string
  horaReserva: string
  solicitante: string
  setor: string
  empresa: string
  situacao: string
}

export default function Dashboard() {
  const [reservas, setReservas] = useState<Reserva[]>(reservasData)
  const [isNovaReservaOpen, setIsNovaReservaOpen] = useState(false)
  const [isVisualizarOpen, setIsVisualizarOpen] = useState(false)
  const [isEditarOpen, setIsEditarOpen] = useState(false)
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null)
  const [formData, setFormData] = useState({
    dataReserva: "",
    horaReserva: "",
    solicitante: "",
    setor: "",
    empresa: "",
    situacao: "",
  })

  const handleNovaReserva = () => {
    setFormData({
      dataReserva: "",
      horaReserva: "",
      solicitante: "",
      setor: "",
      empresa: "",
      situacao: "",
    })
    setIsNovaReservaOpen(true)
  }

  const handleVisualizar = (reserva: Reserva) => {
    setReservaSelecionada(reserva)
    setIsVisualizarOpen(true)
  }

  const handleEditar = (reserva: Reserva) => {
    setReservaSelecionada(reserva)
    setFormData({
      dataReserva: reserva.dataReserva,
      horaReserva: reserva.horaReserva,
      solicitante: reserva.solicitante,
      setor: reserva.setor,
      empresa: reserva.empresa,
      situacao: reserva.situacao,
    })
    setIsEditarOpen(true)
  }

  const handleExcluir = (id: number) => {
    setReservas(reservas.filter((reserva) => reserva.id !== id))
  }

  const handleSalvarNova = () => {
    const novaReserva: Reserva = {
      id: Math.max(...reservas.map((r) => r.id)) + 1,
      ...formData,
    }
    setReservas([...reservas, novaReserva])
    setIsNovaReservaOpen(false)
  }

  const handleSalvarEdicao = () => {
    if (reservaSelecionada) {
      setReservas(
        reservas.map((reserva) =>
          reserva.id === reservaSelecionada.id ? { ...reservaSelecionada, ...formData } : reserva,
        ),
      )
      setIsEditarOpen(false)
    }
  }

  const getSituacaoColor = (situacao: string) => {
    switch (situacao.toLowerCase()) {
      case "confirmada":
        return "bg-green-100 text-green-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900">Reserva de Sala</h1>
        </div>

        <Dialog open={isNovaReservaOpen} onOpenChange={setIsNovaReservaOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNovaReserva} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Reserva
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Reserva</DialogTitle>
              <DialogDescription>Preencha os dados para criar uma nova reserva de sala.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="data" className="text-right">
                  Data
                </Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.dataReserva}
                  onChange={(e) => setFormData({ ...formData, dataReserva: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hora" className="text-right">
                  Hora
                </Label>
                <Input
                  id="hora"
                  type="time"
                  value={formData.horaReserva}
                  onChange={(e) => setFormData({ ...formData, horaReserva: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="solicitante" className="text-right">
                  Solicitante
                </Label>
                <Input
                  id="solicitante"
                  value={formData.solicitante}
                  onChange={(e) => setFormData({ ...formData, solicitante: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="setor" className="text-right">
                  Setor
                </Label>
                <Input
                  id="setor"
                  value={formData.setor}
                  onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="empresa" className="text-right">
                  Empresa
                </Label>
                <Input
                  id="empresa"
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="situacao" className="text-right">
                  Situação
                </Label>
                <Select
                  value={formData.situacao}
                  onValueChange={(value) => setFormData({ ...formData, situacao: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confirmada">Confirmada</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSalvarNova}>
                Salvar Reserva
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data Reserva</TableHead>
              <TableHead>Hora Reserva</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservas.map((reserva) => (
              <TableRow key={reserva.id}>
                <TableCell>{new Date(reserva.dataReserva).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>{reserva.horaReserva}</TableCell>
                <TableCell>{reserva.solicitante}</TableCell>
                <TableCell>{reserva.setor}</TableCell>
                <TableCell>{reserva.empresa}</TableCell>
                <TableCell>
                  <Badge className={getSituacaoColor(reserva.situacao)}>{reserva.situacao}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleVisualizar(reserva)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditar(reserva)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExcluir(reserva.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Visualizar */}
      <Dialog open={isVisualizarOpen} onOpenChange={setIsVisualizarOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Visualizar Reserva</DialogTitle>
            <DialogDescription>Detalhes da reserva selecionada.</DialogDescription>
          </DialogHeader>
          {reservaSelecionada && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Data:</Label>
                <div className="col-span-3">{new Date(reservaSelecionada.dataReserva).toLocaleDateString("pt-BR")}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Hora:</Label>
                <div className="col-span-3">{reservaSelecionada.horaReserva}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Solicitante:</Label>
                <div className="col-span-3">{reservaSelecionada.solicitante}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Setor:</Label>
                <div className="col-span-3">{reservaSelecionada.setor}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsVisualizarOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar */}
      <Dialog open={isEditarOpen} onOpenChange={setIsEditarOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Reserva</DialogTitle>
            <DialogDescription>Altere os dados da reserva conforme necessário.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-data" className="text-right">
                Data
              </Label>
              <Input
                id="edit-data"
                type="date"
                value={formData.dataReserva}
                onChange={(e) => setFormData({ ...formData, dataReserva: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-hora" className="text-right">
                Hora
              </Label>
              <Input
                id="edit-hora"
                type="time"
                value={formData.horaReserva}
                onChange={(e) => setFormData({ ...formData, horaReserva: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-solicitante" className="text-right">
                Solicitante
              </Label>
              <Input
                id="edit-solicitante"
                value={formData.solicitante}
                onChange={(e) => setFormData({ ...formData, solicitante: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-setor" className="text-right">
                Setor
              </Label>
              <Input
                id="edit-setor"
                value={formData.setor}
                onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-empresa" className="text-right">
                Empresa
              </Label>
              <Input
                id="edit-empresa"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-situacao" className="text-right">
                Situação
              </Label>
              <Select
                value={formData.situacao}
                onValueChange={(value) => setFormData({ ...formData, situacao: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Confirmada">Confirmada</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSalvarEdicao}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
