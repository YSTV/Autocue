text = "Some test text"
size = 72
offset = 0

clients = {}

def web_socket_do_extra_handshake(request):
        request.ws_protocol = request.ws_requested_protocols[0]
        pass

def web_socket_transfer_data(request):
        global text, size, offset, clients
        clients[request] = 1

        try:
                request.ws_stream.send_message(str(1) + text, binary=True)
                request.ws_stream.send_message(str(2) + str(size), binary=True)
                request.ws_stream.send_message(str(3) + str(offset), binary=True)

                while True:
                        line = request.ws_stream.receive_message()

                        if line is None:
                                break

                        if (ord(line[0]) == 1):
                                pass # Deprecated
                        elif (ord(line[0]) == 2):
                                pass # Deprecated
                        elif (ord(line[0]) == 3):
                                size = size + (5 if (ord(line[1]) == 1) else -5)
                                broadcast(str(2) + str(size))
                        elif (ord(line[0]) == 4):
                                text = line[1:]
                                broadcast(str(1) + text)
                        elif (ord(line[0]) == 5):
                                offset = int(line[1:])
                                broadcast(str(3) + str(offset))
                        else:
                                for x in line:
                                        print x
                                print "Oh dear"
        except Exception as e:
                raise e
        finally:
                del clients[request]

def broadcast(tosend):
        global clients

        for obj in clients:
                if obj is not None:
                        obj.ws_stream.send_message(tosend, binary=True)
