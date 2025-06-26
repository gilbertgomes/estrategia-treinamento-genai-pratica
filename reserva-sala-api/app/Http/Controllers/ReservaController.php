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
    public function insertReservaSala(Request $request){// gera o insert na talbela reserva

        $input = $request->all();//recebe o request
        $data  = Carbon::now('America/Manaus');

        $data          = trim($input['data']);
        $hora          = trim($input['hora']);
        $solicitante   = trim($input['solicitante']);
        $setor         = trim($input['setor']);
        $empresa       = trim($input['empresa']);
        $situacao      = trim($input['situacao']);
        $uiid          = (string)Str::uuid();

        $validator = Validator::make($input, [ // valida os tipos
            "solicitante"  => "required|string|max:130",
            "setor"        => "required|string|max:30",
        ]);

        $validator->fails();

        if($validator){ //valida

            DB::beginTransaction(); // inicia a transação

            try {

                $reserva = new apiUsuario([

                    'res_data_reserva'       => $data,
                    'res_hora_reserva'       => $hora,
                    'res_nome_soilcitante'   => $solicitante,
                    'res_setor'              => $setor,
                    'res_empresa'            => $empresa,
                    'res_situacao'           => $situacao,
                    'uuid'                   => $uiid,

                ]);
                $reserva->save();

                DB::commit();// comita a transação

                return response($reserva->jsonSerialize(), Response::HTTP_CREATED);

            } catch (\Exception $e) {// caso haja erro retrona o estado

                DB::rollback();

                $json_str = '{"reserva":"'.'0'.'", "erro": "'.'Erro ou não foi possivel completar o processo de insert'.'", "valor":"'.'0'.'"}';
                $obj      = json_decode($json_str);
                return response()->json($e, Response::HTTP_CREATED);
            }

        } else { // caso os tipos não sejam corretos

            $json_str = '{"reserva":"'.'0'.'", "erro": "'.'Erro formato dos dados estão incorretos'.'", "valor":"'.'0'.'"}';
            $obj      = json_decode($json_str);
            return response()->json($obj, Response::HTTP_CREATED);

        }
    }
}
