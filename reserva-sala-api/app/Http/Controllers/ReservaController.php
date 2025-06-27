<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Session;
use Illuminate\Routing\Controller;
use App\Models\Reserva;
use App\Http\Requests;
use Carbon\Carbon;
use DB;
use PDO;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class ReservaController extends Controller
{
    public function listaDadosReserva()////// gera dados para o grid da APP /////
    {

        $situacao = 'reservada';
        $reserva = DB::select("
                                select
                                    id,
                                    to_char(res_data, 'DD/MM/YYYY') as data,
                                    res_data_reserva as datareserva,
                                    res_hora_reserva as horareserva,
                                    res_nome_solicitante as solicitante,
                                    res_setor as setor,
                                    res_empresa as empresa,
                                    res_situacao as situacao,
                                    uuid
                                from reserva_sala
                                where res_situacao = '".$situacao."'
                                order by res_situacao
                               ");

        if(!$reserva){
            return response()->json(['Erro de carga de dados'],404);
        }else{
            return  response()->json($reserva,Response::HTTP_OK);
        }
    }

    public function inserirReserva(Request $request)
    {
        $input = $request->only(['datareserva', 'hora', 'solicitante', 'setor', 'empresa', 'situacao']);
        $datasitema = Carbon::now('America/Manaus');// input api
        $validator  = Validator::make($request->all(), [
            'datareserva' => 'required|date_format:d-m-Y',
            'hora'        => 'required|string|max:5',
            'solicitante' => 'required|string|max:130',
            'setor'       => 'required|string|max:30',
            'empresa'     => 'required|string|max:50',
            'situacao'    => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['erro' => $validator->errors()], 422);
        }

        try {

            DB::beginTransaction();

            $reserva = new Reserva();
            $reserva->res_data             = $datasitema;
            $reserva->res_data_reserva     = Carbon::createFromFormat('d-m-Y', $input['datareserva']);
            $reserva->res_hora_reserva     = $input['hora'];
            $reserva->res_nome_solicitante = $input['solicitante'];
            $reserva->res_setor            = $input['setor'];
            $reserva->res_empresa          = $input['empresa'];
            $reserva->res_situacao         = $input['situacao'];
            $reserva->uuid                 = (string) Str::uuid();
            $reserva->save();

            DB::commit();

            return response()->json($reserva, 201);
        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['erro' => 'Erro ao inserir reserva', 'detalhe' => $e->getMessage()], 500);
        }
    }

    public function alterarReserva(Request $request)
    {
        $input = $request->only(['id', 'datareserva', 'hora', 'solicitante', 'setor', 'empresa', 'situacao']);

        $validator = Validator::make($input, [
            'id'          => 'required|integer|exists:reserva_sala,id',
            'datareserva' => 'required|date_format:d-m-Y',
            'hora'        => 'required|string|max:5',
            'solicitante' => 'required|string|max:130',
            'setor'       => 'required|string|max:30',
            'empresa'     => 'required|string|max:50',
            'situacao'    => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['erro' => $validator->errors()], 422);
        }

        try {
            $reserva = Reserva::find($input['id']);
            if (!$reserva) {
                return response()->json(['erro' => 'Reserva não encontrada'], 404);
            }

            DB::beginTransaction();

            $reserva->res_data_reserva     = Carbon::createFromFormat('d-m-Y', $input['datareserva']);
            $reserva->res_hora_reserva     = trim($input['hora']);
            $reserva->res_nome_solicitante = trim($input['solicitante']);
            $reserva->res_setor            = trim($input['setor']);
            $reserva->res_empresa          = trim($input['empresa']);
            $reserva->res_situacao         = trim($input['situacao']);
            $reserva->save();

            DB::commit();

            return response()->json(['mensagem' => 'Reserva atualizada com sucesso'], Response::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['erro' => 'Erro ao atualizar reserva', 'detalhe' => $e->getMessage()], 500);
        }
    }

    public function excluirReserva(Request $request)
    {
        $input = $request->only(['id']);
        $data  = Carbon::now('America/Manaus');

        // Validação do ID
        $validator = Validator::make($input, [
            'id' => 'required|integer|exists:reserva_sala,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['erro' => $validator->errors()], 422);
        }

        try {
            $reserva = Reserva::find($input['id']);
            if (!$reserva) {
                return response()->json(['erro' => 'Reserva não encontrada'], 404);
            }

            DB::beginTransaction();

            $reserva->res_data      = $data;
            $reserva->res_situacao  = 'EXCLUIDO';
            $reserva->save();

            DB::commit();

            return response()->json(['mensagem' => 'Reserva excluída com sucesso'], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['erro' => 'Erro ao excluir reserva', 'detalhe' => $e->getMessage()], 500);
        }
    }


}
