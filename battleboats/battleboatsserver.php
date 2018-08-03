
        <?php
        header("Access-Control-Allow-Origin:*");
        echo "server recieved ".file_get_contents("php://input")."\n";
        $p = json_decode(file_get_contents("php://input"));
        $list = json_decode(file_get_contents("gamelist.json"));
        $playerNo;
        $gameNo;
        if($p->playerData->id === "reset server m20")
        {
            resetLists();
        }
        elseif($p->playerData->id === "current server status")
        {
            echo "Current Players = ".count($list->players)."\nCurrent Games = ".count($list->games)."\nCleanup Count = ".$list->cleanupCount;
        }
        else if($p->playerData->id === null)//if new player assign id
        {
            echo "Entered New Player Id Assignment \n";
            $playerId = generateId("M20", $list->players);
            $p->playerData->id = $playerId;
            array_push($list->players, $p->playerData);
            $playerNo = count($list->players)-1;
        }
        elseif($p->playerData->game === null)//if player not in game assign player to a game or create new game
        {
            echo "Entered Game Assignment \n";
            if($list->cleanupCount > 2)
            {
                $list->cleanupCount = 0;
                cleanupLists();
            }
            $playerNo = iteratorFromId($p->playerData->id, $list->players);
            $free = 0;
            for($i = 0; $i < count($list->games); $i++)
                {
                    if(!$list->games[$i]->full)//check for free games
                    {
                        $gameNo = $i;
                        $free = $list->games[$i];
                        $list->games[$i]->full = true;
                    }
                }
            if($free === 0)//make a new game
            {
                echo "Entered Make New Game \n";
                $game = new Game(generateId("SES", $list->games));
                $list->players[$playerNo]->host = true;
                array_push($game->players, $list->players[$playerNo]->id);
                $game->status = "New Game Created";
                $list->players[$playerNo]->game = $game;
                array_push($list->games, $game);
                $list->cleanupCount++;
            }
            else// add player to free game with id - $free
            {
                echo "Entered Add to Existing Game \n";
                //$free->state = 1;
                $free->status = "Joined Game";
                $list->players[$playerNo]->game = $free;
                array_push($list->games[$gameNo]->players, $list->players[$playerNo]->id);
            }
        }
        else
        {
            echo "Entered Server Game Logic \n";
            $playerNo = iteratorFromId($p->playerData->id, $list->players);
            $gameNo = iteratorFromId($p->playerData->game->id, $list->games);
            $list->players[$playerNo] = $p->playerData;//update players information in list
            var_dump((new DateTime("now"))->getTimestamp() - $list->games[$gameNo]->updated);
            if($p->playerData->message)
            {
                array_push($list->games[$gameNo]->chat, $p->playerData->message);
                $list->games[$gameNo]->updated = (new DateTime("now"))->getTimestamp();
            }
            switch ($list->games[$gameNo]->state)
            {
                case 0:                                                          //waiting for players
                    if($list->games[$gameNo]->full)
                    {
                        $list->games[$gameNo]->state = 1;
                        $list->games[$gameNo]->updated = (new DateTime("now"))->getTimestamp();
                    }
                    break;
                case 1:                                                         //preparing 0 players ready
                    if(readyCount())
                    {
                        $list->games[$gameNo]->state = 2;
                        $list->games[$gameNo]->updated = (new DateTime("now"))->getTimestamp();
                    }
                    break;
                case 2:                                                         //preparing 1 player ready
                    switch (readyCount())
                    {
                        case 0:
                            $list->games[$gameNo]->state = 1;
                            $list->games[$gameNo]->updated = (new DateTime("now"))->getTimestamp();
                            break;
                        case 2:
                            $list->games[$gameNo]->state = 3;
                            $list->games[$gameNo]->updated = (new DateTime("now"))->getTimestamp();
                            break;
                    }
                    break;
                case 3:                                                         //playing hosts turn
                    
                    break;
                case 4:                                                         //playing clients turn
                    
                    break;
                case 5:                                                         //gameover
                    
                    break;
                
            }
            $list->players[$playerNo]->game = $list->games[$gameNo];//assign updated game info to player ready to send back
        }
        $f = fopen("gamelist.json", "w");
        fwrite($f, json_encode($list));
        fclose($f);
        echo "!#!".json_encode($list->players[$playerNo]);
        
        function generateId($str, $arr) {
            $id = "";
            $unique = 0;
            while(!$unique)
            {
                $id = uniqid($str);
                $unique = 1;
                foreach ($arr as $item) {
                    if($id === $item->id)
                    {
                        $unique = 0;
                    }
                }
            }
            return $id;
        }
        function iteratorFromId($id, $arr)
        {
            $result = null;
            for($i = 0; $i < count($arr); $i++)
            {
                if($arr[$i]->id === $id)
                {
                    $result = $i;
                }
            }
            return $result;
        }
        function readyCount() {
            global $list, $gameNo;
            $ready = 0;
            foreach($list->games[$gameNo]->players as $id)
            {
                if($list->players[$id]->ready)
                {
                    $ready++;
                }
            }
            return $ready;
        }
        function cleanupLists() {
            global $list;
            $estring = "";
            $estring .= "Running Server Cleanup\n  ";
            $now = (new DateTime("now"))->getTimestamp();
            foreach($list->games as $game)
            {
                if($now - $game->updated > 60)
                {
                    $estring .= "Removing expired game - ".$game->id." ET-".($now - $game->updated)."\n  ";
                    foreach($game->players as $player)
                    {
                        $itr = iteratorFromId($player, $list->players);
                        array_splice($list->players,$itr,1);
                    }
                    array_splice($list->games, iteratorFromId($game, $list->games),1);
                }
            }
            echo $estring;
        }
        function resetLists() {
            global $list;
            $list = new ListTemplate;
        }
        class Game {
            function Game($gid) {
                $this->id = $gid;
                $this->players = array();
                $this->full = false;
                $this->state = 0;
                $this->chat = array();
                $this->status = "";
                $this->updated = (new DateTime("now"))->getTimestamp();
            }
            /* game states:
             * 0 = waiting for players
             * 1 = preparing 0 players ready
             * 2 = preparing 1 player ready
             * 3 = playing - hosts turn
             * 4 = playing - clients turn
             * 5 = gameover
            */
        }
        class ListTemplate {
            function ListTemplate() {
                $this->players = array();
                $this->games = array();
                $this->cleanupCount = 0;
            }
        }