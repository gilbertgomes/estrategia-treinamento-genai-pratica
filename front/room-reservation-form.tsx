"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Clock, User, Building2, Building, CheckCircle } from "lucide-react"

interface FormData {
  date: string
  time: string
  requesterName: string
  sector: string
  company: string
  reservationStatus: string
}

interface FormErrors {
  date?: string
  time?: string
  requesterName?: string
  sector?: string
}

export default function RoomReservationForm() {
  const [formData, setFormData] = useState<FormData>({
    date: "",
    time: "",
    requesterName: "",
    sector: "",
    company: "",
    reservationStatus: "pendente",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.date) {
      newErrors.date = "Data da reserva é obrigatória"
    }

    if (!formData.time) {
      newErrors.time = "Horário é obrigatório"
    }

    if (!formData.requesterName.trim()) {
      newErrors.requesterName = "Nome do solicitante é obrigatório"
    }

    if (!formData.sector) {
      newErrors.sector = "Setor é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const sendReservation = async () => {
    const apiUrl = "http://localhost:3071/api/reserva/v1/insert"

    // Mapeando os campos do formulário para os nomes esperados pela API
    const payload = {
      datareserva: formData.date,
      hora: formData.time,
      solicitante: formData.requesterName,
      setor: formData.sector,
      empresa: formData.company,
      situacao: formData.reservationStatus,
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error("Erro ao salvar reserva")
    }

    return response.json()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await sendReservation()
      alert("Reserva criada com sucesso!")
      setFormData({
        date: "",
        time: "",
        requesterName: "",
        sector: "",
        company: "",
        reservationStatus: "pendente",
      })
    } catch (error) {
      alert("Erro ao criar reserva. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Reserva de Sala
          </CardTitle>
          <CardDescription>Preencha os dados para solicitar a reserva de uma sala</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data da Reserva */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Data da Reserva *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className={errors.date ? "border-red-500" : ""}
                />
                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
              </div>

              {/* Horário */}
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário *
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className={errors.time ? "border-red-500" : ""}
                />
                {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
              </div>
            </div>

            {/* Nome do Solicitante */}
            <div className="space-y-2">
              <Label htmlFor="requesterName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome do Solicitante *
              </Label>
              <Input
                id="requesterName"
                type="text"
                placeholder="Digite o nome completo"
                value={formData.requesterName}
                onChange={(e) => handleInputChange("requesterName", e.target.value)}
                className={errors.requesterName ? "border-red-500" : ""}
              />
              {errors.requesterName && <p className="text-sm text-red-500">{errors.requesterName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Setor */}
              <div className="space-y-2">
                <Label htmlFor="sector" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Setor *
                </Label>
                <Select value={formData.sector} onValueChange={(value) => handleInputChange("sector", value)}>
                  <SelectTrigger className={errors.sector ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recursos-humanos">Recursos Humanos</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="vendas">Vendas</SelectItem>
                    <SelectItem value="operacoes">Operações</SelectItem>
                    <SelectItem value="juridico">Jurídico</SelectItem>
                    <SelectItem value="diretoria">Diretoria</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sector && <p className="text-sm text-red-500">{errors.sector}</p>}
              </div>

              {/* Empresa */}
              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Empresa
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Nome da empresa (opcional)"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
              </div>
            </div>

            {/* Situação da Reserva */}
            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Situação da Reserva
              </Label>
              <Select
                value={formData.reservationStatus}
                onValueChange={(value) => handleInputChange("reservationStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovada">Aprovada</SelectItem>
                  <SelectItem value="rejeitada">Rejeitada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Campos obrigatórios (*):</strong> Data da reserva, Horário, Nome do solicitante e Setor devem
                ser preenchidos.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  date: "",
                  time: "",
                  requesterName: "",
                  sector: "",
                  company: "",
                  reservationStatus: "pendente",
                })
                setErrors({})
              }}
            >
              Limpar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Salvando..." : "Criar Reserva"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
