from pyteal import *


class BoxLayout:
    """
    Box value schema (fixed length):
    - score: uint64
    - updated_at: uint64 (unix timestamp)
    Total: 16 bytes
    """

    @staticmethod
    def pack(score: Expr, updated_at: Expr) -> Expr:
        return Concat(Itob(score), Itob(updated_at))

    @staticmethod
    def score(value: Expr) -> Expr:
        return Btoi(Extract(value, Int(0), Int(8)))

    @staticmethod
    def updated_at(value: Expr) -> Expr:
        return Btoi(Extract(value, Int(8), Int(8)))


def build_router() -> Router:
    """
    On-chain risk registry (RiskRegistry).

    Storage:
      - Boxes keyed by each wallet's 32-byte public key (decoded Algorand address bytes).
      - Each box stores score (uint64) and updated_at (uint64, Unix seconds).

    Authorization:
      - Only the application creator may mutate registry entries (set_risk, delete_risk).
    """

    router = Router(
        "RiskRegistry",
        BareCallActions(
            no_op=OnCompleteAction.create_only(Approve()),
            update_application=OnCompleteAction.always(Reject()),
            delete_application=OnCompleteAction.always(Reject()),
            close_out=OnCompleteAction.always(Approve()),
            opt_in=OnCompleteAction.always(Approve()),
        ),
    )

    @router.method
    def set_risk(address_pk: abi.DynamicBytes, score: abi.Uint64) -> Expr:
        pk = address_pk.get()  # expected 32 bytes
        return Seq(
            Assert(Txn.sender() == Global.creator_address()),
            Assert(Len(pk) == Int(32)),
            BoxPut(pk, BoxLayout.pack(score.get(), Global.latest_timestamp())),
        )

    @router.method
    def delete_risk(address_pk: abi.DynamicBytes) -> Expr:
        pk = address_pk.get()
        return Seq(
            Assert(Txn.sender() == Global.creator_address()),
            Assert(Len(pk) == Int(32)),
            Pop(BoxDelete(pk)),
        )

    @router.method
    def get_risk(
        address_pk: abi.DynamicBytes,
        *,
        output: abi.Tuple3[abi.Bool, abi.Uint64, abi.Uint64],
    ) -> Expr:
        pk = address_pk.get()
        box = BoxGet(pk)
        exists = abi.Bool()
        score = abi.Uint64()
        updated_at = abi.Uint64()
        return Seq(
            Assert(Len(pk) == Int(32)),
            box,
            If(box.hasValue())
            .Then(
                Seq(
                    exists.set(Int(1)),
                    score.set(BoxLayout.score(box.value())),
                    updated_at.set(BoxLayout.updated_at(box.value())),
                )
            )
            .Else(
                Seq(
                    exists.set(Int(0)),
                    score.set(Int(0)),
                    updated_at.set(Int(0)),
                )
            ),
            output.set(exists, score, updated_at),
        )

    return router

