import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  collectionData, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  where, 
  limit, 
  getDocs, 
  DocumentReference 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// Interface que define a estrutura da senha
export interface Senha {
  id?: string;
  codigo: string;
  tipo: 'normal' | 'preferencial';
  status: 'aguardando' | 'chamada' | 'atendida';
  hora: string;
  timestamp: number;
  guiche?: number;
}

@Injectable({ providedIn: 'root' })
export class SenhaService {
  private readonly collectionName = 'senhas';

  constructor(private firestore: Firestore) {}

  async gerarSenha(tipo: 'normal' | 'preferencial'): Promise<Senha> {
    const senhasRef = collection(this.firestore, this.collectionName);
    const prefixo = tipo === 'preferencial' ? 'P' : 'N';
    const codigo = prefixo + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const hora = new Date().toLocaleTimeString('pt-BR');
    const currentTimestamp = Date.now();

    const newSenha: Senha = {
      tipo,
      codigo,
      status: 'aguardando',
      hora,
      timestamp: currentTimestamp
    };

    const docRef: DocumentReference = await addDoc(senhasRef, newSenha);
    return { ...newSenha, id: docRef.id };
  }

  listarSenhasAguardando(): Observable<Senha[]> {
    const senhasRef = collection(this.firestore, this.collectionName);
    const q = query(
      senhasRef,
      where('status', '==', 'aguardando'),
      orderBy('timestamp', 'asc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Senha[]>;
  }

  listarUltimasChamadas(limite: number = 5): Observable<Senha[]> {
    const senhasRef = collection(this.firestore, this.collectionName);
    const q = query(
      senhasRef,
      where('status', '==', 'chamada'),
      orderBy('timestamp', 'desc'),
      limit(limite)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Senha[]>;
  }

  async proximaSenha(): Promise<Senha | null> {
    const senhasRef = collection(this.firestore, this.collectionName);
    const q = query(
      senhasRef,
      where('status', '==', 'aguardando'),
      orderBy('timestamp', 'asc'),
      limit(1)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docSnapshot = snapshot.docs[0];
    const docData = docSnapshot.data() as Senha;
    
    return { ...docData, id: docSnapshot.id };
  }

  async atualizarStatus(
    senhaId: string,
    status: 'chamada' | 'atendida',
    guiche?: number
  ): Promise<void> {
    const senhaDoc = doc(this.firestore, this.collectionName, senhaId);
    const updateData: Partial<Senha> = { status };

    if (status === 'chamada') {
      updateData.timestamp = Date.now();
      if (guiche !== undefined) {
        updateData.guiche = Number(guiche);
      } else {
        console.warn(`Senha ${senhaId} marcada como 'chamada' sem guichê definido.`);
      }
    }

    await updateDoc(senhaDoc, updateData);
  }
}
